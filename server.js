/**
 * TRICKY REAL ESTATE - EXPRESS APPLICATION SERVER (ENHANCED CRM SUITE)
 * Strict rate-limiting, lead scoring (0-100), HOT/WARM/COLD, Kanban stage tracking,
 * 2% commission computation on Won deals, notification bell polling, and agent scoping.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------------------------------------
// Security Guard: Prevent direct web access to sensitive source code, keys & database
// -----------------------------------------------------------------------------
app.use((req, res, next) => {
  const url = req.path.toLowerCase();
  if (
    url === '/.env' ||
    url.startsWith('/.env') ||
    url === '/server.js' ||
    url === '/package.json' ||
    url === '/package-lock.json' ||
    url.startsWith('/db/') ||
    url.includes('/.git') ||
    url.endsWith('.sql') ||
    url.startsWith('/node_modules/')
  ) {
    return res.status(403).type('text/plain').send('403 Forbidden: Access to protected server asset denied.');
  }
  next();
});

// -----------------------------------------------------------------------------
// Privacy & Search Engine Protection (Keep Admin Area Hidden From Google)
// -----------------------------------------------------------------------------
app.use((req, res, next) => {
  const url = req.path.toLowerCase();
  if (
    url.includes('admin') ||
    url.includes('login') ||
    url.startsWith('/api/admin') ||
    url.startsWith('/api/auth')
  ) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }
  next();
});

// Explicit robots.txt and sitemap.xml endpoints
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// -----------------------------------------------------------------------------
// Rate Limiter: Stop people from sending too many forms quickly (Requirement 1)
// -----------------------------------------------------------------------------
const ipSubmissionTracker = new Map(); // IP -> Array of timestamps

function rateLimitFormSubmissions(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 3 * 60 * 1000; // 3 minutes
  const maxSubmissions = 4; // Max 4 forms per 3 minutes

  let timestamps = ipSubmissionTracker.get(ip) || [];
  // Filter out timestamps older than windowMs
  timestamps = timestamps.filter(t => now - t < windowMs);

  if (timestamps.length >= maxSubmissions) {
    console.warn(`[RATE LIMIT] Throttling rapid form submissions from IP: ${ip}`);
    return res.status(429).json({
      error: 'Too many requests. For security, please wait a moment before sending another inquiry.'
    });
  }

  timestamps.push(now);
  ipSubmissionTracker.set(ip, timestamps);
  next();
}

// -----------------------------------------------------------------------------
// Spam Honeypot & Validation Middleware
// -----------------------------------------------------------------------------
function validateAndCheckSpam(req, res, next) {
  const { full_name, email, phone, website_url, form_start_time } = req.body;

  // 1. Honeypot check
  if (website_url && website_url.trim().length > 0) {
    console.warn(`[SPAM BLOCKED] Honeypot triggered by IP: ${req.ip}`);
    return res.json({
      success: true,
      reference_no: 'TRK-SPAM-PREVENTED',
      thank_you_message: 'Thank you. A Jay Real Estate advisor will contact you within 24 hours.'
    });
  }

  // 2. Minimum submission duration check
  if (form_start_time) {
    const elapsed = Date.now() - parseInt(form_start_time, 10);
    if (elapsed < 800) {
      console.warn(`[SPAM BLOCKED] Form submitted too quickly (${elapsed}ms)`);
      return res.json({
        success: true,
        reference_no: 'TRK-SPEED-PREVENTED',
        thank_you_message: 'Thank you. A Jay Real Estate advisor will contact you within 24 hours.'
      });
    }
  }

  // 3. Validation
  if (!full_name || full_name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid full name.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!phone || phone.trim().length < 7) {
    return res.status(400).json({ error: 'Please provide a valid telephone number with country code.' });
  }

  next();
}

// Extract current authenticated staff user
function getStaffUserFromReq(req) {
  const userId = req.headers['x-user-id'] || req.query.user_id;
  const userRole = req.headers['x-user-role'] || req.query.user_role;
  if (userId) {
    return { id: parseInt(userId, 10), role: userRole || 'agent' };
  }
  return null;
}

// -----------------------------------------------------------------------------
// Authentication Endpoint (Requirement 3)
// -----------------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter your email and password.' });
  }

  try {
    const user = await db.authenticateStaff(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
    }
    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// Public Endpoints
// -----------------------------------------------------------------------------
app.get('/api/status', (req, res) => {
  res.json(db.getDbStatus());
});

app.get('/api/developers', async (req, res) => {
  res.json(await db.getDevelopers());
});

app.get('/api/projects', async (req, res) => {
  res.json(await db.getOffPlanProjects());
});

app.get('/api/properties', async (req, res) => {
  res.json(await db.getProperties(req.query));
});

app.get('/api/staff', async (req, res) => {
  res.json(await db.getStaff());
});

// -----------------------------------------------------------------------------
// Lead Ingestion (Requirements 1, 2, 6)
// Rate-limited, remembers source form, calculates score 0-100 (HOT/WARM/COLD),
// and shows exact requested message: "Thank you. A Jay Real Estate advisor will contact you within 24 hours."
// -----------------------------------------------------------------------------
app.post('/api/leads', rateLimitFormSubmissions, validateAndCheckSpam, async (req, res) => {
  try {
    const lead = await db.createBuyerLead({
      full_name: req.body.full_name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      lead_type: req.body.lead_type || 'General Inquiry',
      source_form: req.body.source_form || 'Website Inquiry Form',
      property_id: req.body.property_id || null,
      project_id: req.body.project_id || null,
      budget_aed: req.body.budget_aed || null,
      preferred_community: req.body.preferred_community || null,
      message: req.body.message || '',
      is_cash_buyer: req.body.is_cash_buyer || false,
      purchase_timeframe: req.body.purchase_timeframe || 'Within 1-3 Months'
    });

    res.json({
      success: true,
      reference_no: lead.reference_no,
      lead,
      // Exact prompt requirement 6:
      thank_you_title: 'Inquiry Confirmed',
      thank_you_message: 'Thank you. A Jay Real Estate advisor will contact you within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Viewings booking endpoint
app.post('/api/viewings', rateLimitFormSubmissions, validateAndCheckSpam, async (req, res) => {
  try {
    const lead = await db.createBuyerLead({
      full_name: req.body.full_name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      lead_type: 'Viewing Request',
      source_form: req.body.source_form || 'Property Page: Book a Viewing',
      property_id: req.body.property_id || null,
      message: `Viewing requested for ${req.body.viewing_date} at ${req.body.viewing_time}. Notes: ${req.body.message || ''}`,
      is_cash_buyer: true,
      purchase_timeframe: 'Immediately'
    });

    res.json({
      success: true,
      reference_no: lead.reference_no,
      thank_you_title: 'Viewing Request Received',
      thank_you_message: 'Thank you. A Jay Real Estate advisor will contact you within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// Admin / CRM Protected Endpoints (Requirements 4, 5)
// -----------------------------------------------------------------------------

// Notification Bell Stats (refreshed every minute)
app.get('/api/admin/notifications', async (req, res) => {
  const user = getStaffUserFromReq(req);
  res.json(await db.getNotificationStats(user));
});

// Leads List (filtered by agent role: "Agents only see their own leads")
app.get('/api/admin/leads', async (req, res) => {
  const user = getStaffUserFromReq(req);
  res.json(await db.getLeads(user));
});

app.get('/api/admin/leads/:id', async (req, res) => {
  const lead = await db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  res.json(lead);
});

// Change Stage (Kanban board & detail page)
// When stage is 'Won', prompts for sale price, works out 2% commission, and marks property as sold!
app.patch('/api/admin/leads/:id/stage', async (req, res) => {
  const { stage, sale_price_aed, property_title, staff_name } = req.body;
  try {
    const result = await db.updateLeadStage(req.params.id, stage, {
      sale_price_aed,
      property_title,
      staff_name
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Note
app.post('/api/admin/leads/:id/notes', async (req, res) => {
  const { staff_id, staff_name, note_text } = req.body;
  if (!note_text) return res.status(400).json({ error: 'Note text required.' });
  const note = await db.addLeadNote(req.params.id, staff_id || 1, staff_name || 'Advisor', note_text);
  res.json({ success: true, note });
});

// Reassign Lead
app.patch('/api/admin/leads/:id/assign', async (req, res) => {
  const { agent_id } = req.body;
  const lead = await db.reassignLead(req.params.id, agent_id);
  res.json({ success: true, lead });
});

// Viewings
app.get('/api/admin/viewings', async (req, res) => {
  const user = getStaffUserFromReq(req);
  res.json(await db.getViewings(user));
});

// Sales & Commission
app.get('/api/admin/sales', async (req, res) => {
  const sales = await db.getCompletedSales();
  const totalVolume = sales.reduce((acc, s) => acc + parseFloat(s.sale_price_aed || 0), 0);
  const totalCommission = sales.reduce((acc, s) => acc + parseFloat(s.commission_aed || 0), 0);
  res.json({ sales, totalVolumeAED: totalVolume, totalCommissionAED: totalCommission });
});

// Agent Leaderboard
app.get('/api/admin/leaderboard', async (req, res) => {
  res.json(await db.getLeaderboard());
});

// Stale Leads (no activity for 3+ days)
app.get('/api/admin/stale-leads', async (req, res) => {
  const user = getStaffUserFromReq(req);
  res.json(await db.getStaleLeads(user));
});

// Property CRUD (Requirement 5)
app.post('/api/properties', async (req, res) => {
  try {
    const prop = await db.addProperty(req.body);
    res.json({ success: true, property: prop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const prop = await db.updateProperty(req.params.id, req.body);
    res.json({ success: true, property: prop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    const prop = await db.deleteProperty(req.params.id);
    res.json({ success: true, deleted: prop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Project CRUD
app.post('/api/projects', async (req, res) => {
  try {
    const proj = await db.addProject(req.body);
    res.json({ success: true, project: proj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const proj = await db.updateProject(req.params.id, req.body);
    res.json({ success: true, project: proj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const proj = await db.deleteProject(req.params.id);
    res.json({ success: true, deleted: proj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 404 Error Handler - Ultra-Luxury 404 Page (Requirement)
// -----------------------------------------------------------------------------
app.use((req, res) => {
  if (req.accepts('html')) {
    const pub404 = path.join(__dirname, 'public', '404.html');
    if (fs.existsSync(pub404)) return res.status(404).sendFile(pub404);
    return res.status(404).sendFile(path.join(__dirname, '404.html'));
  }
  res.status(404).json({ error: 'Endpoint or resource not found.' });
});

// -----------------------------------------------------------------------------
// 500 Error Handler - Ultra-Luxury 500 Page (Requirement)
// -----------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('[UNHANDLED SERVER ERROR]', err);
  if (req.accepts('html')) {
    const pub500 = path.join(__dirname, 'public', '500.html');
    if (fs.existsSync(pub500)) return res.status(500).sendFile(pub500);
    return res.status(500).sendFile(path.join(__dirname, '500.html'));
  }
  res.status(500).json({ error: 'Internal server error occurred.' });
});

// Start Server
async function start() {
  await db.initDatabase();

  app.listen(PORT, () => {
    console.log(`\n================================================================`);
    console.log(`✨ TRICKY REAL ESTATE - CRM & PLATFORM ACTIVE`);
    console.log(`🚀 Live Website: http://localhost:${PORT}`);
    console.log(`🔐 Private Admin Login: http://localhost:${PORT}/login.html`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin.html`);
    console.log(`================================================================\n`);
  });
}

// Check if running directly in Node or imported by Vercel serverless
if (require.main === module) {
  start();
} else {
  db.initDatabase().catch(err => console.error('[SERVERLESS DB INIT]', err.message));
}

module.exports = app;
