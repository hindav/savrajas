/* ==========================================================================
   SAVRAJAS BACKEND SUPABASE DATABASE CLIENT (backend/config/supabase.js)
   Centralized secure connection to Supabase database
   ========================================================================== */

import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://npcvgvpzaznzgisrhhea.supabase.co').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

function getHeaders(preferHeader = null) {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
  if (preferHeader) {
    headers['Prefer'] = preferHeader;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// 1. PRICING OPERATIONS
// ---------------------------------------------------------------------------
export async function getPricing() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_pricing?id=eq.active_config&select=data,updated_at`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) {
      console.error('[DB] getPricing failed with status:', res.status);
      return null;
    }
    const list = await res.json();
    return list && list.length > 0 ? list[0].data : null;
  } catch (err) {
    console.error('[DB] getPricing error:', err);
    return null;
  }
}

export async function savePricing(pricingData) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_pricing?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders('resolution=merge-duplicates'),
      body: JSON.stringify({
        id: 'active_config',
        data: pricingData,
        updated_at: new Date().toISOString()
      })
    });
    return res.ok;
  } catch (err) {
    console.error('[DB] savePricing error:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// 2. PORTFOLIO OPERATIONS
// ---------------------------------------------------------------------------
export async function getPortfolio() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_portfolio?id=eq.active_portfolio&select=projects,updated_at`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) {
      console.error('[DB] getPortfolio failed with status:', res.status);
      return null;
    }
    const list = await res.json();
    return list && list.length > 0 ? list[0].projects : null;
  } catch (err) {
    console.error('[DB] getPortfolio error:', err);
    return null;
  }
}

export async function savePortfolio(portfolioData) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_portfolio?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders('resolution=merge-duplicates'),
      body: JSON.stringify({
        id: 'active_portfolio',
        projects: portfolioData,
        updated_at: new Date().toISOString()
      })
    });
    return res.ok;
  } catch (err) {
    console.error('[DB] savePortfolio error:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// 3. LEADS & CRM OPERATIONS
// ---------------------------------------------------------------------------
export async function getLeads() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_leads?select=*&status=neq.deleted&order=created_at.desc`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) {
      console.error('[DB] getLeads failed with status:', res.status);
      return [];
    }
    const rows = await res.json();
    return rows.map(r => ({
      id: r.id,
      timestamp: r.created_at,
      name: r.name || 'Valued Client',
      email: r.email || '',
      phone: r.phone || '',
      projectType: r.project_type || 'Custom Software',
      addons: r.addons || '',
      maintenance: r.maintenance || '',
      tier: r.tier || '',
      totalPrice: Number(r.total_price) || 0,
      currency: 'INR',
      status: r.status || 'new'
    }));
  } catch (err) {
    console.error('[DB] getLeads error:', err);
    return [];
  }
}

export async function createLead(lead) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_leads`, {
      method: 'POST',
      headers: getHeaders('return=representation'),
      body: JSON.stringify({
        name: lead.name || 'Valued Client',
        email: lead.email || '',
        phone: lead.phone || '',
        project_type: lead.projectType || lead.project_type || 'Inquiry',
        addons: lead.addons || '',
        maintenance: lead.maintenance || '',
        tier: lead.tier || '',
        total_price: Number(lead.totalPrice || lead.total_price) || 0,
        status: lead.status || 'new',
        created_at: lead.timestamp || new Date().toISOString()
      })
    });
    if (!res.ok) {
      console.error('[DB] createLead failed with status:', res.status);
      return null;
    }
    const created = await res.json();
    return created && created.length > 0 ? created[0] : null;
  } catch (err) {
    console.error('[DB] createLead error:', err);
    return null;
  }
}

export async function updateLeadStatus(id, status) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_leads?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch (err) {
    console.error('[DB] updateLeadStatus error:', err);
    return false;
  }
}

export async function deleteLead(id) {
  try {
    // Soft delete to preserve safety, and attempt hard delete
    const res = await fetch(`${SUPABASE_URL}/rest/v1/savrajas_leads?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'deleted' })
    });
    return res.ok;
  } catch (err) {
    console.error('[DB] deleteLead error:', err);
    return false;
  }
}

