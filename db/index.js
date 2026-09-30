/**
 * TRICKY REAL ESTATE - DATABASE CONTROLLER (NEON POSTGRESQL + LOCAL SECURE STORE)
 * Hardened Authentication, Password Hashing, Agent Access Scoping,
 * Full CRM Logic & PostgreSQL Persistence Synchronization.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const seedData = require('./seedData');

let pool = null;
let isNeonConnected = false;
let neonError = null;

// Password Hashing & Verification (OWASP A02:2021 Remediation)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  if (stored.includes(':')) {
    const [salt, key] = stored.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    if (keyBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  }
  // Backwards compatibility with initial plain text seeds, upgrade seamlessly
  return stored === password.trim();
}

// Local In-Memory Storage
let memoryStore = {
  developers: [...seedData.developers],
  staff_logins: seedData.staff_logins.map(s => ({
    ...s,
    // Ensure passwords in memory store are hashed
    password: s.password.includes(':') ? s.password : hashPassword(s.password)
  })),
  off_plan_projects: [...seedData.off_plan_projects],
  properties: [...seedData.properties],
  buyer_leads: [...seedData.sample_leads],
  viewings: [...seedData.sample_viewings],
  completed_sales: [...seedData.sample_sales],
  notes: [...seedData.sample_notes]
};

async function initDatabase() {
  const connectionString = process.env.DATABASE_URL && process.env.DATABASE_URL.trim();

  if (!connectionString) {
    console.log('\n[DATABASE] No DATABASE_URL found in .env.');
    console.log('[DATABASE] Running on embedded store with full sample dataset.');
    console.log('[DATABASE] 👉 To connect to Neon: Paste your Neon connection string in .env after DATABASE_URL=\n');
    isNeonConnected = false;
    return;
  }

  try {
    console.log('[DATABASE] Attempting to connect to Neon PostgreSQL...');
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 7000
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();

    isNeonConnected = true;
    neonError = null;
    console.log(`[DATABASE] ✅ Successfully connected to Neon PostgreSQL! (Server time: ${result.rows[0].now})`);

    await runMigrationsAndSeed();
  } catch (err) {
    isNeonConnected = false;
    neonError = err.message;
    console.error('[DATABASE] ⚠️ Error connecting to Neon PostgreSQL:', err.message);
    console.log('[DATABASE] Falling back to embedded in-memory database so website continues operating seamlessly.');
  }
}

async function runMigrationsAndSeed() {
  if (!pool || !isNeonConnected) return;

  const client = await pool.connect();
  try {
    let schemaSql = '';
    try {
      schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    } catch (e) {
      console.warn('[DATABASE] schema.sql disk read notice:', e.message);
    }
    if (schemaSql) {
      await client.query(schemaSql);
    }

    const devCheck = await client.query('SELECT COUNT(*) FROM developers');
    if (parseInt(devCheck.rows[0].count, 10) === 0) {
      console.log('[DATABASE] Seeding Neon database with full CRM dataset...');

      for (const dev of seedData.developers) {
        await client.query(
          `INSERT INTO developers (id, name, slug, established_year, headquarters, description, total_projects)
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (slug) DO NOTHING`,
          [dev.id, dev.name, dev.slug, dev.established_year, dev.headquarters, dev.description, dev.total_projects]
        );
      }

      for (const staff of memoryStore.staff_logins) {
        await client.query(
          `INSERT INTO staff_logins (id, name, email, password, role, phone, bio, avatar_url, monthly_target_aed)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (email) DO NOTHING`,
          [staff.id, staff.name, staff.email, staff.password, staff.role, staff.phone, staff.bio, staff.avatar_url, staff.monthly_target_aed]
        );
      }

      for (const proj of seedData.off_plan_projects) {
        await client.query(
          `INSERT INTO off_plan_projects (id, slug, name, developer_id, community, starting_price_aed, handover_date, payment_plan_summary, down_payment_pct, during_construction_pct, on_handover_pct, description, bedrooms_available, roi_estimate, image_url, featured)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) ON CONFLICT (slug) DO NOTHING`,
          [proj.id, proj.slug, proj.name, proj.developer_id, proj.community, proj.starting_price_aed, proj.handover_date, proj.payment_plan_summary, proj.down_payment_pct, proj.during_construction_pct, proj.on_handover_pct, proj.description, proj.bedrooms_available, proj.roi_estimate, proj.image_url, proj.featured]
        );
      }

      for (const prop of seedData.properties) {
        await client.query(
          `INSERT INTO properties (id, slug, title, property_type, community, sub_community, price_aed, bedrooms, bathrooms, built_up_sqft, status, featured, description, image_url, amenities, agent_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) ON CONFLICT (slug) DO NOTHING`,
          [prop.id, prop.slug, prop.title, prop.property_type, prop.community, prop.sub_community, prop.price_aed, prop.bedrooms, prop.bathrooms, prop.built_up_sqft, prop.status, prop.featured, prop.description, prop.image_url, prop.amenities, prop.agent_id]
        );
      }

      for (const lead of seedData.sample_leads) {
        await client.query(
          `INSERT INTO buyer_leads (id, reference_no, full_name, email, phone, lead_type, source_form, property_id, project_id, budget_aed, preferred_community, message, score, score_label, is_cash_buyer, purchase_timeframe, stage, assigned_agent_id, last_activity_date, is_read)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) ON CONFLICT (reference_no) DO NOTHING`,
          [lead.id, lead.reference_no, lead.full_name, lead.email, lead.phone, lead.lead_type, lead.source_form, lead.property_id || null, lead.project_id || null, lead.budget_aed, lead.preferred_community, lead.message, lead.score, lead.score_label, lead.is_cash_buyer, lead.purchase_timeframe, lead.stage, lead.assigned_agent_id || 1, lead.last_activity_date, lead.is_read]
        );
      }

      for (const v of seedData.sample_viewings) {
        await client.query(
          `INSERT INTO viewings (id, lead_id, property_id, staff_id, viewing_date, viewing_time, status, feedback)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
          [v.id, v.lead_id, v.property_id, v.staff_id, v.viewing_date, v.viewing_time, v.status, v.feedback]
        );
      }

      for (const s of seedData.sample_sales) {
        await client.query(
          `INSERT INTO completed_sales (id, property_id, property_title, community, buyer_name, staff_id, sale_price_aed, commission_aed, sale_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
          [s.id, s.property_id, s.property_title, s.community, s.buyer_name, s.staff_id, s.sale_price_aed, s.commission_aed, s.sale_date]
        );
      }

      for (const n of seedData.sample_notes) {
        await client.query(
          `INSERT INTO notes (id, lead_id, staff_id, staff_name, note_text)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
          [n.id, n.lead_id, n.staff_id, n.staff_name, n.note_text]
        );
      }

      await client.query(`SELECT setval('developers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM developers))`);
      await client.query(`SELECT setval('staff_logins_id_seq', (SELECT COALESCE(MAX(id), 1) FROM staff_logins))`);
      await client.query(`SELECT setval('off_plan_projects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM off_plan_projects))`);
      await client.query(`SELECT setval('properties_id_seq', (SELECT COALESCE(MAX(id), 1) FROM properties))`);
      await client.query(`SELECT setval('buyer_leads_id_seq', (SELECT COALESCE(MAX(id), 1) FROM buyer_leads))`);
      await client.query(`SELECT setval('viewings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM viewings))`);
      await client.query(`SELECT setval('completed_sales_id_seq', (SELECT COALESCE(MAX(id), 1) FROM completed_sales))`);
      await client.query(`SELECT setval('notes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notes))`);

      console.log('[DATABASE] ✅ Seeding complete! All CRM tables populated in Neon.');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DATABASE] Migration error:', err.message);
  } finally {
    client.release();
  }
}

// -----------------------------------------------------------------------------
// Authentication (Hashed Password Verification)
// -----------------------------------------------------------------------------
async function authenticateStaff(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (isNeonConnected && pool) {
    const res = await pool.query('SELECT * FROM staff_logins WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
    if (res.rows.length === 0) return null;
    const user = res.rows[0];
    if (verifyPassword(cleanPassword, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  const user = memoryStore.staff_logins.find(s => s.email.toLowerCase() === cleanEmail);
  if (user && verifyPassword(cleanPassword, user.password)) {
    const safeUser = { ...user };
    delete safeUser.password;
    return safeUser;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Leads with Scoring (0-100), HOT/WARM/COLD & Agent Scoping
// -----------------------------------------------------------------------------
async function createBuyerLead(data) {
  const refNo = 'TRK-' + Math.floor(100000 + Math.random() * 900000);
  
  const isCash = data.is_cash_buyer === true || data.is_cash_buyer === 'true' || /cash/i.test(data.message || '');
  const timeframe = data.purchase_timeframe || (/immediate|asap|urgent|this week/i.test(data.message || '') ? 'Immediately' : 'Within 1-3 Months');

  const { score, label } = seedData.calculateLeadScore({
    phone: data.phone,
    property_id: data.property_id,
    project_id: data.project_id,
    budget_aed: data.budget_aed,
    is_cash_buyer: isCash,
    purchase_timeframe: timeframe
  });

  let assignedAgentId = 1;
  if (data.property_id) {
    const p = memoryStore.properties.find(prop => prop.id === parseInt(data.property_id, 10));
    if (p && p.agent_id) assignedAgentId = p.agent_id;
  } else {
    assignedAgentId = (memoryStore.buyer_leads.length % 3) + 1;
  }

  const lead = {
    reference_no: refNo,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    lead_type: data.lead_type || 'General Inquiry',
    source_form: data.source_form || 'Web Form',
    property_id: data.property_id ? parseInt(data.property_id, 10) : null,
    project_id: data.project_id ? parseInt(data.project_id, 10) : null,
    budget_aed: data.budget_aed || null,
    preferred_community: data.preferred_community || null,
    message: data.message || '',
    score,
    score_label: label,
    is_cash_buyer: isCash,
    purchase_timeframe: timeframe,
    stage: 'New',
    assigned_agent_id: assignedAgentId,
    last_activity_date: new Date().toISOString(),
    is_read: false,
    created_at: new Date()
  };

  if (isNeonConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO buyer_leads (reference_no, full_name, email, phone, lead_type, source_form, property_id, project_id, budget_aed, preferred_community, message, score, score_label, is_cash_buyer, purchase_timeframe, stage, assigned_agent_id, last_activity_date, is_read)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         RETURNING *`,
        [lead.reference_no, lead.full_name, lead.email, lead.phone, lead.lead_type, lead.source_form, lead.property_id, lead.project_id, lead.budget_aed, lead.preferred_community, lead.message, lead.score, lead.score_label, lead.is_cash_buyer, lead.purchase_timeframe, lead.stage, lead.assigned_agent_id, lead.last_activity_date, lead.is_read]
      );
      lead.id = res.rows[0].id;
    } catch (e) {
      console.error('[DATABASE] Neon lead insert warning:', e.message);
    }
  }

  if (!lead.id) lead.id = memoryStore.buyer_leads.length + 1;
  memoryStore.buyer_leads.unshift(lead);
  return lead;
}

// "Agents only see their own leads" (Strict scoping & unauthenticated protection)
async function getLeads(currentUser) {
  if (!currentUser) return [];

  let list = [];
  if (isNeonConnected && pool) {
    let query = `
      SELECT l.*, p.title AS property_title, o.name AS project_name, s.name AS agent_name
      FROM buyer_leads l
      LEFT JOIN properties p ON l.property_id = p.id
      LEFT JOIN off_plan_projects o ON l.project_id = o.id
      LEFT JOIN staff_logins s ON l.assigned_agent_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (currentUser.role === 'agent') {
      params.push(currentUser.id);
      query += ` AND l.assigned_agent_id = $${params.length}`;
    } else if (currentUser.role !== 'admin') {
      return [];
    }
    query += ' ORDER BY l.id DESC';
    const res = await pool.query(query, params);
    list = res.rows;
  } else {
    list = memoryStore.buyer_leads.map(l => {
      const prop = memoryStore.properties.find(p => p.id === l.property_id);
      const proj = memoryStore.off_plan_projects.find(o => o.id === l.project_id);
      const staff = memoryStore.staff_logins.find(s => s.id === l.assigned_agent_id);
      return {
        ...l,
        property_title: prop ? prop.title : null,
        project_name: proj ? proj.name : null,
        agent_name: staff ? staff.name : 'Tariq Al-Mansoor'
      };
    });

    if (currentUser.role === 'agent') {
      list = list.filter(l => l.assigned_agent_id === currentUser.id);
    } else if (currentUser.role !== 'admin') {
      return [];
    }
  }

  return list;
}

async function getLeadById(id) {
  const leadId = parseInt(id, 10);
  const lead = memoryStore.buyer_leads.find(l => l.id === leadId);
  if (!lead) return null;
  const notes = memoryStore.notes.filter(n => n.lead_id === leadId);
  const viewings = memoryStore.viewings.filter(v => v.lead_id === leadId);
  const prop = memoryStore.properties.find(p => p.id === lead.property_id);
  const staff = memoryStore.staff_logins.find(s => s.id === lead.assigned_agent_id);
  return {
    ...lead,
    notes,
    viewings,
    property: prop,
    agent_name: staff ? staff.name : 'Unassigned'
  };
}

// Stage Update & "Won" 2% Commission Logic
async function updateLeadStage(leadId, newStage, extraData = {}) {
  const id = parseInt(leadId, 10);
  let lead = memoryStore.buyer_leads.find(l => l.id === id);
  if (!lead) return null;

  lead.stage = newStage;
  lead.last_activity_date = new Date().toISOString();

  if (isNeonConnected && pool) {
    try {
      await pool.query('UPDATE buyer_leads SET stage = $1, last_activity_date = NOW() WHERE id = $2', [newStage, id]);
    } catch (e) {
      console.warn('[DATABASE] Neon stage update warning:', e.message);
    }
  }

  let saleRecord = null;
  if (newStage === 'Won') {
    const salePrice = parseFloat(extraData.sale_price_aed) || (lead.property_id ? 15000000 : 8000000);
    const commission = salePrice * 0.02; // Exactly 2% commission

    if (lead.property_id) {
      const prop = memoryStore.properties.find(p => p.id === lead.property_id);
      if (prop) {
        prop.status = 'Sold';
        if (isNeonConnected && pool) {
          pool.query("UPDATE properties SET status = 'Sold' WHERE id = $1", [lead.property_id]).catch(() => {});
        }
      }
    }

    saleRecord = {
      id: memoryStore.completed_sales.length + 1,
      property_id: lead.property_id || null,
      property_title: extraData.property_title || (lead.property_id ? 'Prime Dubai Residence' : 'Bespoke Off-Plan Allocation'),
      community: lead.preferred_community || 'Dubai Prime',
      buyer_name: lead.full_name,
      staff_id: lead.assigned_agent_id || 1,
      sale_price_aed: salePrice,
      commission_aed: commission,
      sale_date: new Date().toISOString().split('T')[0]
    };
    memoryStore.completed_sales.unshift(saleRecord);

    if (isNeonConnected && pool) {
      pool.query(
        `INSERT INTO completed_sales (property_id, property_title, community, buyer_name, staff_id, sale_price_aed, commission_aed, sale_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [saleRecord.property_id, saleRecord.property_title, saleRecord.community, saleRecord.buyer_name, saleRecord.staff_id, saleRecord.sale_price_aed, saleRecord.commission_aed, saleRecord.sale_date]
      ).catch(() => {});
    }

    const note = {
      id: memoryStore.notes.length + 1,
      lead_id: id,
      staff_id: lead.assigned_agent_id || 1,
      staff_name: extraData.staff_name || 'System',
      note_text: `🎉 Deal Closed WON! Sale Price: AED ${salePrice.toLocaleString('en-US')}. 2% Advisory Commission: AED ${commission.toLocaleString('en-US')}. Property marked as SOLD.`,
      created_at: new Date().toISOString()
    };
    memoryStore.notes.unshift(note);
    if (isNeonConnected && pool) {
      pool.query(
        `INSERT INTO notes (lead_id, staff_id, staff_name, note_text) VALUES ($1, $2, $3, $4)`,
        [note.lead_id, note.staff_id, note.staff_name, note.note_text]
      ).catch(() => {});
    }
  }

  return { lead, saleRecord };
}

// Add Note
async function addLeadNote(leadId, staffId, staffName, text) {
  const note = {
    id: memoryStore.notes.length + 1,
    lead_id: parseInt(leadId, 10),
    staff_id: staffId,
    staff_name: staffName,
    note_text: text,
    created_at: new Date().toISOString()
  };
  memoryStore.notes.unshift(note);

  const lead = memoryStore.buyer_leads.find(l => l.id === parseInt(leadId, 10));
  if (lead) lead.last_activity_date = new Date().toISOString();

  if (isNeonConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO notes (lead_id, staff_id, staff_name, note_text) VALUES ($1, $2, $3, $4)`,
        [note.lead_id, note.staff_id, note.staff_name, note.note_text]
      );
      await pool.query('UPDATE buyer_leads SET last_activity_date = NOW() WHERE id = $1', [note.lead_id]);
    } catch (e) {
      console.warn('[DATABASE] Neon note insert warning:', e.message);
    }
  }

  return note;
}

// Reassign Lead
async function reassignLead(leadId, newAgentId) {
  const lead = memoryStore.buyer_leads.find(l => l.id === parseInt(leadId, 10));
  if (lead) {
    lead.assigned_agent_id = parseInt(newAgentId, 10);
    lead.last_activity_date = new Date().toISOString();

    if (isNeonConnected && pool) {
      try {
        await pool.query('UPDATE buyer_leads SET assigned_agent_id = $1, last_activity_date = NOW() WHERE id = $2', [lead.assigned_agent_id, lead.id]);
      } catch (e) {
        console.warn('[DATABASE] Neon reassign warning:', e.message);
      }
    }
    return lead;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Notification Bell: Count of New / Unread leads
// -----------------------------------------------------------------------------
async function getNotificationStats(currentUser) {
  if (!currentUser) return { unreadCount: 0, recentLeads: [] };

  let leads = memoryStore.buyer_leads;
  if (currentUser.role === 'agent') {
    leads = leads.filter(l => l.assigned_agent_id === currentUser.id);
  }

  const unreadCount = leads.filter(l => !l.is_read || l.stage === 'New').length;
  const recentLeads = leads.slice(0, 5).map(l => ({
    id: l.id,
    ref: l.reference_no,
    name: l.full_name,
    form: l.source_form,
    score: l.score,
    label: l.score_label,
    time: l.created_at
  }));

  return { unreadCount, recentLeads };
}

// -----------------------------------------------------------------------------
// Stale Leads (No Activity for 3+ days)
// -----------------------------------------------------------------------------
async function getStaleLeads(currentUser) {
  if (!currentUser) return [];

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  let leads = memoryStore.buyer_leads.filter(l => 
    l.stage !== 'Won' && 
    l.stage !== 'Lost' && 
    new Date(l.last_activity_date) <= threeDaysAgo
  );

  if (currentUser.role === 'agent') {
    leads = leads.filter(l => l.assigned_agent_id === currentUser.id);
  }

  return leads.map(l => {
    const staff = memoryStore.staff_logins.find(s => s.id === l.assigned_agent_id);
    const diffDays = Math.floor((new Date() - new Date(l.last_activity_date)) / (1000 * 60 * 60 * 24));
    return {
      ...l,
      days_inactive: diffDays,
      agent_name: staff ? staff.name : 'Unassigned'
    };
  });
}

// -----------------------------------------------------------------------------
// Agent Leaderboard
// -----------------------------------------------------------------------------
async function getLeaderboard() {
  const agents = memoryStore.staff_logins.filter(s => s.role === 'agent');
  return agents.map(agent => {
    const sales = memoryStore.completed_sales.filter(s => s.staff_id === agent.id);
    const totalVolume = sales.reduce((acc, s) => acc + parseFloat(s.sale_price_aed || 0), 0);
    const totalCommission = sales.reduce((acc, s) => acc + parseFloat(s.commission_aed || 0), 0);
    const target = parseFloat(agent.monthly_target_aed || 30000000);
    const targetPct = Math.round((totalVolume / target) * 100);

    return {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      deals_count: sales.length,
      volume_aed: totalVolume,
      commission_aed: totalCommission,
      target_aed: target,
      target_pct: targetPct
    };
  }).sort((a, b) => b.volume_aed - a.volume_aed);
}

// -----------------------------------------------------------------------------
// Property & Project CRUD Operations (with PostgreSQL Sync)
// -----------------------------------------------------------------------------
async function addProperty(data) {
  const newProp = {
    id: memoryStore.properties.length + 1,
    slug: (data.title || 'luxury-property').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
    title: data.title,
    property_type: data.property_type || 'Villa',
    community: data.community,
    sub_community: data.sub_community || '',
    price_aed: parseFloat(data.price_aed) || 5000000,
    bedrooms: parseInt(data.bedrooms, 10) || 3,
    bathrooms: parseInt(data.bathrooms, 10) || 3,
    built_up_sqft: parseInt(data.built_up_sqft, 10) || 2500,
    status: 'Ready',
    featured: data.featured === true || data.featured === 'true',
    description: data.description || 'Exclusive luxury residence in Dubai.',
    image_url: data.image_url || 'assets/images/palm_villa.jpg',
    amenities: Array.isArray(data.amenities) ? data.amenities : ['Panoramic Views', 'Private Pool', 'Concierge Service'],
    agent_id: parseInt(data.agent_id, 10) || 1
  };

  if (isNeonConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO properties (slug, title, property_type, community, sub_community, price_aed, bedrooms, bathrooms, built_up_sqft, status, featured, description, image_url, amenities, agent_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [newProp.slug, newProp.title, newProp.property_type, newProp.community, newProp.sub_community, newProp.price_aed, newProp.bedrooms, newProp.bathrooms, newProp.built_up_sqft, newProp.status, newProp.featured, newProp.description, newProp.image_url, newProp.amenities, newProp.agent_id]
      );
      newProp.id = res.rows[0].id;
    } catch (e) {
      console.warn('[DATABASE] Neon property insert warning:', e.message);
    }
  }

  memoryStore.properties.unshift(newProp);
  return newProp;
}

async function updateProperty(id, data) {
  const propId = parseInt(id, 10);
  const prop = memoryStore.properties.find(p => p.id === propId);
  if (!prop) return null;
  Object.assign(prop, data);

  if (isNeonConnected && pool) {
    try {
      await pool.query(
        `UPDATE properties SET title = COALESCE($1, title), price_aed = COALESCE($2, price_aed), community = COALESCE($3, community) WHERE id = $4`,
        [data.title, data.price_aed, data.community, propId]
      );
    } catch (e) {
      console.warn('[DATABASE] Neon property update warning:', e.message);
    }
  }
  return prop;
}

async function deleteProperty(id) {
  const propId = parseInt(id, 10);
  const index = memoryStore.properties.findIndex(p => p.id === propId);
  if (index !== -1) {
    const deleted = memoryStore.properties.splice(index, 1)[0];
    if (isNeonConnected && pool) {
      try {
        await pool.query('DELETE FROM properties WHERE id = $1', [propId]);
      } catch (e) {
        console.warn('[DATABASE] Neon property delete warning:', e.message);
      }
    }
    return deleted;
  }
  return null;
}

async function addProject(data) {
  const newProj = {
    id: memoryStore.off_plan_projects.length + 1,
    slug: (data.name || 'off-plan-project').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
    name: data.name,
    developer_id: parseInt(data.developer_id, 10) || 1,
    community: data.community,
    starting_price_aed: parseFloat(data.starting_price_aed) || 3000000,
    handover_date: data.handover_date || 'Q4 2027',
    payment_plan_summary: data.payment_plan_summary || '60/40 Milestone Plan',
    down_payment_pct: parseInt(data.down_payment_pct, 10) || 20,
    during_construction_pct: parseInt(data.during_construction_pct, 10) || 40,
    on_handover_pct: parseInt(data.on_handover_pct, 10) || 40,
    description: data.description || 'Visionary luxury architectural development in Dubai.',
    bedrooms_available: data.bedrooms_available || '2, 3 & 4 Bedrooms',
    roi_estimate: data.roi_estimate || '8.5% Net Yield',
    image_url: data.image_url || 'assets/images/offplan_tower.jpg',
    featured: true
  };

  if (isNeonConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO off_plan_projects (slug, name, developer_id, community, starting_price_aed, handover_date, payment_plan_summary, down_payment_pct, during_construction_pct, on_handover_pct, description, bedrooms_available, roi_estimate, image_url, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [newProj.slug, newProj.name, newProj.developer_id, newProj.community, newProj.starting_price_aed, newProj.handover_date, newProj.payment_plan_summary, newProj.down_payment_pct, newProj.during_construction_pct, newProj.on_handover_pct, newProj.description, newProj.bedrooms_available, newProj.roi_estimate, newProj.image_url, newProj.featured]
      );
      newProj.id = res.rows[0].id;
    } catch (e) {
      console.warn('[DATABASE] Neon project insert warning:', e.message);
    }
  }

  memoryStore.off_plan_projects.unshift(newProj);
  return newProj;
}

async function updateProject(id, data) {
  const projId = parseInt(id, 10);
  const proj = memoryStore.off_plan_projects.find(p => p.id === projId);
  if (!proj) return null;
  Object.assign(proj, data);
  return proj;
}

async function deleteProject(id) {
  const projId = parseInt(id, 10);
  const index = memoryStore.off_plan_projects.findIndex(p => p.id === projId);
  if (index !== -1) {
    const deleted = memoryStore.off_plan_projects.splice(index, 1)[0];
    if (isNeonConnected && pool) {
      pool.query('DELETE FROM off_plan_projects WHERE id = $1', [projId]).catch(() => {});
    }
    return deleted;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Existing queries
// -----------------------------------------------------------------------------
async function getDevelopers() { return memoryStore.developers; }
async function getOffPlanProjects() { return memoryStore.off_plan_projects; }
async function getProperties(filter = {}) {
  let list = memoryStore.properties;
  if (filter.community && filter.community !== 'all') {
    list = list.filter(p => p.community.toLowerCase().includes(filter.community.toLowerCase()));
  }
  if (filter.property_type && filter.property_type !== 'all') {
    list = list.filter(p => p.property_type.toLowerCase() === filter.property_type.toLowerCase());
  }
  return list;
}

async function getViewings(currentUser) {
  if (!currentUser) return [];

  let list = memoryStore.viewings.map(v => {
    const prop = memoryStore.properties.find(p => p.id === v.property_id);
    const lead = memoryStore.buyer_leads.find(l => l.id === v.lead_id);
    const staff = memoryStore.staff_logins.find(s => s.id === v.staff_id);
    return {
      ...v,
      property_title: prop ? prop.title : 'Prime Dubai Residence',
      client_name: lead ? lead.full_name : 'Private Client',
      client_phone: lead ? lead.phone : '',
      agent_name: staff ? staff.name : 'Tariq Al-Mansoor'
    };
  });
  if (currentUser.role === 'agent') {
    list = list.filter(v => v.staff_id === currentUser.id);
  }
  return list;
}

async function getCompletedSales() { return memoryStore.completed_sales; }
async function getStaff() { return memoryStore.staff_logins; }

function getDbStatus() {
  return {
    isNeonConnected,
    mode: isNeonConnected ? 'Neon PostgreSQL (Cloud Active)' : 'Local Embedded Engine (Ready for Neon URL)',
    neonError,
    counts: {
      developers: memoryStore.developers.length,
      off_plan_projects: memoryStore.off_plan_projects.length,
      properties: memoryStore.properties.length,
      buyer_leads: memoryStore.buyer_leads.length,
      viewings: memoryStore.viewings.length,
      completed_sales: memoryStore.completed_sales.length,
      staff_logins: memoryStore.staff_logins.length
    }
  };
}

module.exports = {
  initDatabase,
  getDbStatus,
  getDevelopers,
  getOffPlanProjects,
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  addProject,
  updateProject,
  deleteProject,
  authenticateStaff,
  createBuyerLead,
  getLeads,
  getLeadById,
  updateLeadStage,
  addLeadNote,
  reassignLead,
  getNotificationStats,
  getStaleLeads,
  getLeaderboard,
  getViewings,
  getCompletedSales,
  getStaff,
  hashPassword,
  verifyPassword
};
