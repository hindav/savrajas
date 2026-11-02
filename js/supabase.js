/* ==========================================================================
   SAVRAJAS SUPABASE CLIENT MODULE (js/supabase.js)
   Real-Time Cloud Sync for Pricing, Portfolio, and CRM Leads
   ========================================================================== */

const DEFAULT_SUPABASE_URL = 'https://npcvgvpzaznzgisrhhea.supabase.co';

export function getSupabaseConfig() {
  const url = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
  let anonKey = '';
  
  // 1. Check user manual override in localStorage
  if (typeof localStorage !== 'undefined') {
    anonKey = localStorage.getItem('savrajas_supabase_anon_key') || '';
  }
  
  // 2. Check .env environment variable
  if (!anonKey && typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY.trim();
  }
  
  return {
    url: url.replace(/\/$/, ''),
    anonKey: anonKey
  };
}

export function isSupabaseConfigured() {
  const { anonKey } = getSupabaseConfig();
  return Boolean(anonKey && anonKey.length > 20 && !anonKey.includes('placeholder'));
}

export function saveSupabaseAnonKey(key) {
  if (typeof localStorage !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('savrajas_supabase_anon_key', key.trim());
    } else {
      localStorage.removeItem('savrajas_supabase_anon_key');
    }
  }
}

function getHeaders(preferHeader = null) {
  const { anonKey } = getSupabaseConfig();
  const headers = {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': 'application/json'
  };
  if (preferHeader) {
    headers['Prefer'] = preferHeader;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// 1. PRICING SYNC
// ---------------------------------------------------------------------------
export async function pushPricingToCloud(pricingData) {
  if (!isSupabaseConfigured()) return false;
  const { url } = getSupabaseConfig();

  try {
    const res = await fetch(`${url}/rest/v1/savrajas_pricing?on_conflict=id`, {
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
    console.warn('[Supabase] pushPricingToCloud error:', err);
    return false;
  }
}

export async function fetchPricingFromCloud() {
  if (!isSupabaseConfigured()) return null;
  const { url } = getSupabaseConfig();

  try {
    const res = await fetch(`${url}/rest/v1/savrajas_pricing?id=eq.active_config&select=data`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const list = await res.json();
    return list && list.length > 0 ? list[0].data : null;
  } catch (err) {
    console.warn('[Supabase] fetchPricingFromCloud error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 2. PORTFOLIO SYNC
// ---------------------------------------------------------------------------
export async function pushPortfolioToCloud(portfolioData) {
  if (!isSupabaseConfigured()) return false;
  const { url } = getSupabaseConfig();

  try {
    const res = await fetch(`${url}/rest/v1/savrajas_portfolio?on_conflict=id`, {
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
    console.warn('[Supabase] pushPortfolioToCloud error:', err);
    return false;
  }
}

export async function fetchPortfolioFromCloud() {
  if (!isSupabaseConfigured()) return null;
  const { url } = getSupabaseConfig();

  try {
    const res = await fetch(`${url}/rest/v1/savrajas_portfolio?id=eq.active_portfolio&select=projects`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const list = await res.json();
    return list && list.length > 0 ? list[0].projects : null;
  } catch (err) {
    console.warn('[Supabase] fetchPortfolioFromCloud error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. LEADS & CRM SYNC
// ---------------------------------------------------------------------------
export async function pushLeadToCloud(lead) {
  if (!isSupabaseConfigured()) return false;
  const { url } = getSupabaseConfig();

  try {
    const res = await fetch(`${url}/rest/v1/savrajas_leads`, {
      method: 'POST',
      headers: getHeaders('return=representation'),
      body: JSON.stringify({
        name: lead.name || 'Valued Client',
        email: lead.email || '',
        phone: lead.phone || '',
        project_type: lead.projectType || lead.project_type || '',
        addons: lead.addons || '',
        maintenance: lead.maintenance || '',
        tier: lead.tier || '',
        total_price: lead.totalPrice || lead.total_price || 0,
        status: lead.status || 'new',
        created_at: lead.timestamp || new Date().toISOString()
      })
    });
    return res.ok;
  } catch (err) {
    console.warn('[Supabase] pushLeadToCloud error:', err);
    return false;
  }
}

export async function fetchLeadsFromCloud() {
  if (!isSupabaseConfigured()) return null;
  const { url } = getSupabaseConfig();

  try {
    const res = await fetch(`${url}/rest/v1/savrajas_leads?select=*&status=neq.deleted&order=created_at.desc`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) return null;
    const rows = await res.json();
    // Normalize into standard CRM lead format and exclude deleted
    return rows
      .filter(r => r.status !== 'deleted')
      .map(r => ({
        id: r.id,
        timestamp: r.created_at,
        name: r.name,
        email: r.email,
        phone: r.phone,
        projectType: r.project_type,
        addons: r.addons,
        maintenance: r.maintenance,
        tier: r.tier,
        totalPrice: Number(r.total_price) || 0,
        currency: 'INR',
        status: r.status || 'new'
      }));
  } catch (err) {
    console.warn('[Supabase] fetchLeadsFromCloud error:', err);
    return null;
  }
}

export async function updateLeadStatusInCloud(leadId, status) {
  if (!isSupabaseConfigured()) return false;
  const { url } = getSupabaseConfig();

  try {
    const res = await fetch(`${url}/rest/v1/savrajas_leads?id=eq.${leadId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch (err) {
    console.warn('[Supabase] updateLeadStatusInCloud error:', err);
    return false;
  }
}

export async function deleteLeadFromCloud(lead) {
  if (!isSupabaseConfigured()) return false;
  const { url } = getSupabaseConfig();

  try {
    let query = '';
    if (lead.id) {
      query = `id=eq.${lead.id}`;
    } else if (lead.timestamp) {
      query = `created_at=eq.${encodeURIComponent(lead.timestamp)}`;
    } else if (lead.email) {
      query = `email=eq.${encodeURIComponent(lead.email)}`;
    } else {
      return false;
    }

    // 1. Soft-delete via PATCH status='deleted' (Always allowed by update policy in Supabase!)
    try {
      await fetch(`${url}/rest/v1/savrajas_leads?${query}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'deleted' })
      });
    } catch (e) {}

    // 2. Also attempt hard-delete via DELETE
    try {
      await fetch(`${url}/rest/v1/savrajas_leads?${query}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (e) {}

    return true;
  } catch (err) {
    console.warn('[Supabase] deleteLeadFromCloud error:', err);
    return false;
  }
}
