/**
 * TRICKY REAL ESTATE - EXPRESS APPLICATION SERVER (ENHANCED CRM SUITE)
 * Strict rate-limiting, lead scoring (0-100), HOT/WARM/COLD, Kanban stage tracking,
 * 2% commission computation on Won deals, notification bell polling, and agent scoping.
 * Remediated & Hardened against OWASP Top 10 vulnerabilities.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'tricky-super-secure-session-key-2026';

// Disable Technology Fingerprint
app.disable('x-powered-by');

// Trust Proxy for accurate client IP resolution behind load balancers/Vercel
app.set('trust proxy', 1);

// Security Headers Middleware (OWASP A05:2021 Remediation)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
  );
  next();
});

// Universal Body Parser (Safe for Vercel Serverless pre-parsed requests and local Node)
app.use((req, res, next) => {
  if (req.body !== undefined && typeof req.body === 'object' && req.body !== null) {
    return next();
  }
  express.json()(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true })(req, res, next);
  });
});

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
  const pubRobots = path.join(__dirname, 'public', 'robots.txt');
  if (fs.existsSync(pubRobots)) return res.sendFile(pubRobots);
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const pubSitemap = path.join(__dirname, 'public', 'sitemap.xml');
  if (fs.existsSync(pubSitemap)) return res.sendFile(pubSitemap);
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

// Serve only public assets statically with proper caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Fallback static serve for root HTML pages if not in public
app.get(['/', '/index.html'], (req, res) => {
  const pubIndex = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(pubIndex)) return res.sendFile(pubIndex);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// -----------------------------------------------------------------------------
// Cryptographic Session Token Generation & Verification (OWASP A01/A07 Remediation)
// -----------------------------------------------------------------------------
function generateStaffToken(user) {
  const payload = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

function verifyStaffToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b64Payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(b64Payload).digest('base64url');
  
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Authentication Middleware
function requireStaffAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.substring(7).trim()
    : (req.headers['x-staff-token'] || req.query.staff_token);

  const user = verifyStaffToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required to access private CRM.' });
  }
  req.staffUser = user;
  next();
}

// Admin Role Check Middleware
function requireAdminAuth(req, res, next) {
  requireStaffAuth(req, res, () => {
    if (req.staffUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Master Admin privileges required for this operation.' });
    }
    next();
  });
}

// -----------------------------------------------------------------------------
// Rate Limiter: Safe IP extraction and auto-pruning (SEC-07 Remediation)
// -----------------------------------------------------------------------------
const ipSubmissionTracker = new Map(); // IP -> Array of timestamps

// Periodic pruning of stale IPs to avoid memory leak
setInterval(() => {
  const now = Date.now();
  const windowMs = 3 * 60 * 1000;
  for (const [ip, timestamps] of ipSubmissionTracker.entries()) {
    const valid = timestamps.filter(t => now - t < windowMs);
    if (valid.length === 0) {
      ipSubmissionTracker.delete(ip);
    } else {
      ipSubmissionTracker.set(ip, valid);
    }
  }
}, 5 * 60 * 1000);

function rateLimitFormSubmissions(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 3 * 60 * 1000; // 3 minutes
  const maxSubmissions = 4; // Max 4 forms per 3 minutes

  let timestamps = ipSubmissionTracker.get(ip) || [];
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
      thank_you_message: 'Thank you. A Tricky Real Estate advisor will contact you within 24 hours.'
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
        thank_you_message: 'Thank you. A Tricky Real Estate advisor will contact you within 24 hours.'
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

// -----------------------------------------------------------------------------
// Authentication Endpoint (SEC-01 / SEC-08 Remediation)
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

    const token = generateStaffToken(user);
    res.json({
      success: true,
      user,
      token
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
  // Public staff listings omit sensitive target or login data
  const staff = await db.getStaff();
  const publicStaff = staff.map(s => ({
    id: s.id,
    name: s.name,
    role: s.role,
    phone: s.phone,
    bio: s.bio,
    avatar_url: s.avatar_url
  }));
  res.json(publicStaff);
});

// -----------------------------------------------------------------------------
// Lead Ingestion
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
      thank_you_title: 'Inquiry Confirmed',
      thank_you_message: 'Thank you. A Tricky Real Estate advisor will contact you within 24 hours.'
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
      message: `Viewing requested for ${req.body.viewing_date || 'TBD'} at ${req.body.viewing_time || 'TBD'}. Notes: ${req.body.message || ''}`,
      is_cash_buyer: true,
      purchase_timeframe: 'Immediately'
    });

    res.json({
      success: true,
      reference_no: lead.reference_no,
      thank_you_title: 'Viewing Request Received',
      thank_you_message: 'Thank you. A Tricky Real Estate advisor will contact you within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// Admin / CRM Protected Endpoints (SEC-01 / SEC-08 / SEC-03 Remediation)
// -----------------------------------------------------------------------------

// Notification Bell Stats
app.get('/api/admin/notifications', requireStaffAuth, async (req, res) => {
  res.json(await db.getNotificationStats(req.staffUser));
});

// Leads List (strictly filtered by verified staffUser)
app.get('/api/admin/leads', requireStaffAuth, async (req, res) => {
  res.json(await db.getLeads(req.staffUser));
});

app.get('/api/admin/leads/:id', requireStaffAuth, async (req, res) => {
  const lead = await db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  if (req.staffUser.role === 'agent' && lead.assigned_agent_id !== req.staffUser.id) {
    return res.status(403).json({ error: 'Access restricted to your assigned leads.' });
  }
  res.json(lead);
});

// Change Stage (Kanban board & detail page)
app.patch('/api/admin/leads/:id/stage', requireStaffAuth, async (req, res) => {
  const { stage, sale_price_aed, property_title, staff_name } = req.body;
  try {
    const result = await db.updateLeadStage(req.params.id, stage, {
      sale_price_aed,
      property_title,
      staff_name: staff_name || req.staffUser.name
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Note
app.post('/api/admin/leads/:id/notes', requireStaffAuth, async (req, res) => {
  const { note_text } = req.body;
  if (!note_text) return res.status(400).json({ error: 'Note text required.' });
  const note = await db.addLeadNote(req.params.id, req.staffUser.id, req.staffUser.name, note_text);
  res.json({ success: true, note });
});

// Reassign Lead (Admin only)
app.patch('/api/admin/leads/:id/assign', requireAdminAuth, async (req, res) => {
  const { agent_id } = req.body;
  const lead = await db.reassignLead(req.params.id, agent_id);
  res.json({ success: true, lead });
});

// Viewings
app.get('/api/admin/viewings', requireStaffAuth, async (req, res) => {
  res.json(await db.getViewings(req.staffUser));
});

// Sales & Commission
app.get('/api/admin/sales', requireStaffAuth, async (req, res) => {
  const sales = await db.getCompletedSales();
  const totalVolume = sales.reduce((acc, s) => acc + parseFloat(s.sale_price_aed || 0), 0);
  const totalCommission = sales.reduce((acc, s) => acc + parseFloat(s.commission_aed || 0), 0);
  res.json({ sales, totalVolumeAED: totalVolume, totalCommissionAED: totalCommission });
});

// Agent Leaderboard
app.get('/api/admin/leaderboard', requireStaffAuth, async (req, res) => {
  res.json(await db.getLeaderboard());
});

// Stale Leads
app.get('/api/admin/stale-leads', requireStaffAuth, async (req, res) => {
  res.json(await db.getStaleLeads(req.staffUser));
});

// Property CRUD (Staff / Admin Protected)
app.post('/api/properties', requireStaffAuth, async (req, res) => {
  try {
    const prop = await db.addProperty(req.body);
    res.json({ success: true, property: prop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/properties/:id', requireStaffAuth, async (req, res) => {
  try {
    const prop = await db.updateProperty(req.params.id, req.body);
    res.json({ success: true, property: prop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/properties/:id', requireAdminAuth, async (req, res) => {
  try {
    const prop = await db.deleteProperty(req.params.id);
    res.json({ success: true, deleted: prop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Project CRUD
app.post('/api/projects', requireStaffAuth, async (req, res) => {
  try {
    const proj = await db.addProject(req.body);
    res.json({ success: true, project: proj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', requireStaffAuth, async (req, res) => {
  try {
    const proj = await db.updateProject(req.params.id, req.body);
    res.json({ success: true, project: proj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', requireAdminAuth, async (req, res) => {
  try {
    const proj = await db.deleteProject(req.params.id);
    res.json({ success: true, deleted: proj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 404 Error Handler - Luxury 404 Page (FNC-01 Fixed)
// -----------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    const pub404 = path.join(__dirname, 'public', '404.html');
    if (fs.existsSync(pub404)) return res.sendFile(pub404);
    const root404 = path.join(__dirname, '404.html');
    if (fs.existsSync(root404)) return res.sendFile(root404);
  }
  res.json({ error: 'Endpoint or resource not found.' });
});

// -----------------------------------------------------------------------------
// 500 Error Handler - Luxury 500 Page (Without Stack Trace Leakage)
// -----------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('[UNHANDLED SERVER ERROR]', err.message);
  res.status(500);
  if (req.accepts('html') && !req.path.startsWith('/api/')) {
    const pub500 = path.join(__dirname, 'public', '500.html');
    if (fs.existsSync(pub500)) return res.sendFile(pub500);
    const root500 = path.join(__dirname, '500.html');
    if (fs.existsSync(root500)) return res.sendFile(root500);
  }
  res.json({ error: 'Internal server error occurred.' });
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
    console.log(`🛡️  Security hardening & token authentication active`);
    console.log(`================================================================\n`);
  });
}

if (require.main === module) {
  start();
} else {
  db.initDatabase().catch(err => console.error('[SERVERLESS DB INIT]', err.message));
}

module.exports = app;
