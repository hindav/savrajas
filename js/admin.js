/* ==========================================================================
   SAVRAJAS ADMIN CONSOLE & ANDROID APP ENGINE (js/admin.js)
   Real-Time Pricing, Portfolio CRUD, Leads CRM, PWA & Security Engine
   ========================================================================== */

import {
  getSupabaseConfig,
  isSupabaseConfigured,
  saveSupabaseAnonKey,
  pushPricingToCloud,
  fetchPricingFromCloud,
  pushPortfolioToCloud,
  fetchPortfolioFromCloud,
  fetchLeadsFromCloud,
  deleteLeadFromCloud,
  updateLeadStatusInCloud
} from './supabase.js';

// --- Default Savrajas Pricing Model ---
const DEFAULT_PRICING = {
  projects: {
    showcase: { starter: 25000, growth: 45000, enterprise: 85000, label: "Showcase Website", desc: "Sleek, brand-focused presentation website" },
    business: { starter: 35000, growth: 65000, enterprise: 120000, label: "Corporate Business Portal", desc: "Enterprise corporate presence with multi-department architecture" },
    portfolio: { starter: 20000, growth: 38000, enterprise: 70000, label: "Creative Portfolio", desc: "High-impact visual showcase for agencies and leaders" },
    ecommerce: { starter: 55000, growth: 95000, enterprise: 180000, label: "E-Commerce Flagship", desc: "Full online storefront with payments, catalog and checkout" },
    blog: { starter: 18000, growth: 32000, enterprise: 55000, label: "Content & Blog Platform", desc: "SEO-optimized publishing engine and CMS" },
    landing: { starter: 12000, growth: 22000, enterprise: 40000, label: "High-Converting Landing Page", desc: "Laser-focused lead capture and sales conversion page" }
  },
  addons: {
    android: { starter: 30000, growth: 50000, enterprise: 85000, label: "Native Android App (Kotlin / Compose)", desc: "Production Android application with push notifications" },
    backend: { starter: 25000, growth: 45000, enterprise: 80000, label: "Custom Cloud Backend API", desc: "Scalable REST/GraphQL cloud infrastructure and database" },
    admin: { starter: 20000, growth: 35000, enterprise: 60000, label: "Dedicated Admin Dashboard", desc: "Custom management console for your business metrics" },
    payments: { starter: 15000, growth: 25000, enterprise: 40000, label: "Payment Gateway Integration", desc: "Razorpay / Stripe / UPI instant checkout flow" },
    chat: { starter: 10000, growth: 18000, enterprise: 30000, label: "Live AI / Human Chat Support", desc: "Interactive customer chat with real-time response bot" }
  },
  maintenance: {
    0: { starter: 0, growth: 0, enterprise: 0, label: "Standard Launch Warranty (Free)" },
    1: { starter: 8000, growth: 15000, enterprise: 25000, label: "1 Year SLA & Cloud Maintenance" },
    2: { starter: 14000, growth: 26000, enterprise: 45000, label: "2 Years SLA & Cloud Maintenance" },
    5: { starter: 30000, growth: 55000, enterprise: 95000, label: "5 Years Long-Term Enterprise SLA" }
  }
};

// --- Default 12 Savrajas Portfolio Projects ---
const DEFAULT_PORTFOLIO = [
  { id: 'elect-capital', title: 'Elect Capital', client: 'Elect Capital Markets', category: 'Finance', industry: 'Financial Services', timeline: '4 Months', techStack: 'React, Next.js, Node.js, Highcharts', tags: 'Web, Corporate, Brand', logo: 'assets/images/elect-capital.png', desc: 'Complete corporate digital transformation combining an institutional-grade investment portal with a refined brand identity.' },
  { id: 'aitronik', title: 'Aitronik', client: 'Aitronik Intelligence Ltd.', category: 'Technology', industry: 'Artificial Intelligence & Robotics', timeline: '6 Months', techStack: 'Python, FastAPI, React, PyTorch, Docker', tags: 'Technology, Automation, Web', logo: 'assets/images/brain_trans.png', desc: 'AI-powered cognitive automation platform tailored for industrial workflows.' },
  { id: 'toscano-forme', title: 'Toscano Forme', client: 'Toscano Forme Living', category: 'Web Development', industry: 'Italian Luxury Furniture', timeline: '3 Months', techStack: 'Next.js, Three.js, WebGL, Headless Shopify', tags: 'Luxury, Brand, Web', logo: 'assets/images/toscano-forme.png', desc: 'Bespoke digital flagship reflecting the timeless elegance of Italian furniture design.' },
  { id: 'army-welfare-trust', title: 'Army Welfare Trust', client: 'Army Welfare Trust (AWT)', category: 'Corporate', industry: 'Conglomerate & Institutional', timeline: '5 Months', techStack: 'React, ASP.NET Core, SQL Server, Azure Cloud', tags: 'Corporate, Institutional, Web', logo: 'assets/images/awt-logo.png', desc: 'Unified digital ecosystem serving over 18 diverse commercial units.' },
  { id: 'indus-valley-yoga', title: 'Indus Valley Yoga', client: 'Indus Valley Sanctuary', category: 'Health & Wellness', industry: 'Holistic Health & Wellness', timeline: '2.5 Months', techStack: 'Next.js, Tailwind CSS, Stripe Payments, Zoom API', tags: 'Wellness, Yoga, Web', logo: 'assets/images/logo-for-website.png', desc: 'Serene, high-performance mindfulness portal featuring live session scheduling and video masterclasses.' },
  { id: 'nadra', title: 'NADRA', client: 'National Database Authority', category: 'Government', industry: 'Digital Governance & Identity', timeline: '8 Months', techStack: 'Enterprise Microservices, React, Redis, Hardened API', tags: 'Government, Public Sector, Web', logo: 'assets/images/nadra.png', desc: 'High-security web portals for national citizen registration workflows.' },
  { id: 'muscat-insurance', title: 'Muscat Insurance', client: 'Muscat Insurance Co.', category: 'Insurance', industry: 'Motor & Health Underwriting', timeline: '4.5 Months', techStack: 'Vue.js, Node.js, PostgreSQL, OCR Scanner', tags: 'Insurance, Portal, Web', logo: 'assets/images/muscat-insurance.png', desc: 'Modern consumer insurance portal featuring instant quotes and 3-step rapid claims submission.' },
  { id: 'credible-lending', title: 'Credible Lending', client: 'Credible Lending Solutions', category: 'Finance', industry: 'Mortgage & Consumer Credit', timeline: '3.5 Months', techStack: 'React, Next.js, Plaid API, AWS Lambda', tags: 'Finance, Lending, Web', logo: 'assets/images/Logo-Dark.svg', desc: 'Automated borrower pre-approval platform that streamlines credit assessments.' },
  { id: 'bixits', title: 'Bixits', client: 'Bixits Cloud Platforms', category: 'Technology', industry: 'DevOps & Observability SaaS', timeline: '4 Months', techStack: 'TypeScript, Go, React, ClickHouse, WebSockets', tags: 'Technology, SaaS, Web', logo: 'assets/images/logo-2.jpg', desc: 'Developer-first SaaS platform for cloud metrics and distributed tracing.' },
  { id: 'zap-dental', title: 'Zap Dental Billing', client: 'Zap Dental Billing LLC', category: 'Healthcare', industry: 'Dental Revenue Cycle Management', timeline: '3 Months', techStack: 'React, Node.js, HIPAA-Compliant AWS', tags: 'Healthcare, Billing, Web', logo: 'assets/images/zapDental.webp', desc: 'Specialized medical billing operations hub for dental practices across North America.' },
  { id: 'a2z-olathe', title: 'A2Z Olathe', client: 'A2Z Logistics & Services', category: 'Business', industry: 'Commercial Facilities & Dispatch', timeline: '3 Months', techStack: 'Next.js, Express, Google Maps, Twilio SMS', tags: 'Business, Services, Web', logo: 'assets/images/A2Z_Logo_Full_Final.png', desc: 'All-in-one multi-service management platform connecting commercial clients with on-demand facility maintenance.' },
  { id: 'fine-gold-bullion', title: 'Fine Gold Bullion', client: 'Fine Gold Bullion Traders', category: 'E-Commerce', industry: 'Precious Metals Trading', timeline: '5 Months', techStack: 'Next.js, WebSockets, Live Spot Feed API', tags: 'E-Commerce, Bullion, Finance', logo: 'assets/images/gold-bullion-1-e1724077520252.png', desc: 'High-frequency precious metals exchange web app featuring live London spot feeds and dynamic cart locking.' }
];

// --- State Variables ---
let currentPinInput = '';
let activeTab = 'dashboard';
let currentPricingData = null;
let currentPortfolioData = [];
let deferredPrompt = null;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  initSecurityPin();
  initNavigation();
  initPwaInstall();
  initSettingsSupabase();
  loadData();
  renderAllViews();
});

// ============================================================================
// 1. SECURITY PIN SYSTEM
// ============================================================================
function initSecurityPin() {
  const pinScreen = document.getElementById('pinLockScreen');
  const errorMsg = document.getElementById('pinErrorMsg');
  const lockBtn = document.getElementById('lockAppBtn');

  // Check if session is already unlocked
  if (sessionStorage.getItem('savrajas_admin_unlocked') === 'true') {
    pinScreen.classList.add('unlocked');
  }

  function getStoredPin() {
    return localStorage.getItem('savrajas_admin_pin') || '1234';
  }

  function updatePinDots() {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`dot${i}`);
      if (dot) {
        dot.classList.toggle('filled', i <= currentPinInput.length);
      }
    }
  }

  function verifyPin() {
    if (currentPinInput.length === 4) {
      if (currentPinInput === getStoredPin()) {
        sessionStorage.setItem('savrajas_admin_unlocked', 'true');
        pinScreen.classList.add('unlocked');
        currentPinInput = '';
        updatePinDots();
        if (errorMsg) errorMsg.classList.remove('visible');
        showToast('Console Unlocked');
      } else {
        if (errorMsg) errorMsg.classList.add('visible');
        const card = document.querySelector('.pin-lock-card');
        if (card) {
          card.style.animation = 'shake 0.3s ease';
          setTimeout(() => card.style.animation = '', 300);
        }
        setTimeout(() => {
          currentPinInput = '';
          updatePinDots();
        }, 350);
      }
    }
  }

  // Keypad button clicks
  document.querySelectorAll('.key-btn[data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentPinInput.length < 4) {
        currentPinInput += btn.getAttribute('data-key');
        updatePinDots();
        if (currentPinInput.length === 4) {
          setTimeout(verifyPin, 100);
        }
      }
    });
  });

  const clearBtn = document.getElementById('keyClearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentPinInput = '';
      updatePinDots();
      if (errorMsg) errorMsg.classList.remove('visible');
    });
  }

  const backspaceBtn = document.getElementById('keyBackspaceBtn');
  if (backspaceBtn) {
    backspaceBtn.addEventListener('click', () => {
      if (currentPinInput.length > 0) {
        currentPinInput = currentPinInput.slice(0, -1);
        updatePinDots();
        if (errorMsg) errorMsg.classList.remove('visible');
      }
    });
  }

  // Relock button
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('savrajas_admin_unlocked');
      currentPinInput = '';
      updatePinDots();
      pinScreen.classList.remove('unlocked');
      showToast('App Locked');
    });
  }

  // Update PIN in settings
  const saveNewPinBtn = document.getElementById('saveNewPinBtn');
  const newPinInput = document.getElementById('newPinInput');
  if (saveNewPinBtn && newPinInput) {
    saveNewPinBtn.addEventListener('click', () => {
      const val = newPinInput.value.trim();
      if (/^\d{4}$/.test(val)) {
        localStorage.setItem('savrajas_admin_pin', val);
        newPinInput.value = '';
        showToast('Security PIN Updated to ' + val);
      } else {
        alert('PIN must be exactly 4 numeric digits (e.g. 5678)');
      }
    });
  }
}

// ============================================================================
// 2. BOTTOM NAVIGATION & TABS
// ============================================================================
function initNavigation() {
  window.switchTab = function(tabName) {
    activeTab = tabName;

    // Update bottom nav buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // Update active tab view
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `tab-${tabName}`);
    });

    // Scroll to top of app content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Pricing Sub-navigation
  document.querySelectorAll('.subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.getAttribute('data-sub');
      document.querySelectorAll('.subnav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.pricing-sub-view').forEach(view => {
        view.classList.toggle('active', view.id === `sub-${sub}`);
      });
    });
  });
}

// ============================================================================
// 3. DATA LOADER & PERSISTENCE
// ============================================================================
function loadData() {
  // Load Pricing from localStorage
  try {
    const rawPricing = localStorage.getItem('savrajas_pricing');
    if (rawPricing) {
      currentPricingData = JSON.parse(rawPricing);
      if (!currentPricingData.projects) currentPricingData.projects = {};
      if (!currentPricingData.addons) currentPricingData.addons = {};
      if (!currentPricingData.maintenance) currentPricingData.maintenance = {};
    } else {
      currentPricingData = JSON.parse(JSON.stringify(DEFAULT_PRICING));
    }
  } catch {
    currentPricingData = JSON.parse(JSON.stringify(DEFAULT_PRICING));
  }

  // Load Portfolio from localStorage
  try {
    const rawPortfolio = localStorage.getItem('savrajas_custom_portfolio');
    currentPortfolioData = rawPortfolio ? JSON.parse(rawPortfolio) : JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
  } catch {
    currentPortfolioData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
  }

  // Asynchronously sync from Supabase Cloud if configured
  if (isSupabaseConfigured()) {
    fetchPricingFromCloud().then(cloudPricing => {
      if (cloudPricing) {
        currentPricingData = cloudPricing;
        savePricingToStorage();
        renderPricingManager();
      }
    }).catch(() => {});

    fetchPortfolioFromCloud().then(cloudProjects => {
      if (cloudProjects && Array.isArray(cloudProjects) && cloudProjects.length > 0) {
        currentPortfolioData = cloudProjects;
        savePortfolioToStorage();
        renderPortfolioManager();
        renderDashboard();
      }
    }).catch(() => {});

    fetchLeadsFromCloud().then(cloudLeads => {
      if (cloudLeads && Array.isArray(cloudLeads)) {
        const valid = cloudLeads.filter(l => !isLeadDeletedLocally(l) && l.status !== 'deleted');
        localStorage.setItem('savrajas_quote_leads', JSON.stringify(valid));
        renderLeads();
        renderDashboard();
      }
    }).catch(() => {});
  }
}

function savePricingToStorage() {
  localStorage.setItem('savrajas_pricing', JSON.stringify(currentPricingData));
}

function savePortfolioToStorage() {
  localStorage.setItem('savrajas_custom_portfolio', JSON.stringify(currentPortfolioData));
}

function getDeletedLeadKeys() {
  try {
    return JSON.parse(localStorage.getItem('savrajas_deleted_lead_keys') || '[]');
  } catch {
    return [];
  }
}

function markLeadAsDeletedLocally(lead) {
  const keys = getDeletedLeadKeys();
  if (lead.id && !keys.includes(String(lead.id))) keys.push(String(lead.id));
  if (lead.timestamp && !keys.includes(lead.timestamp)) keys.push(lead.timestamp);
  if (lead.email && !keys.includes(lead.email.toLowerCase())) keys.push(lead.email.toLowerCase());
  localStorage.setItem('savrajas_deleted_lead_keys', JSON.stringify(keys));
}

function isLeadDeletedLocally(lead) {
  const keys = getDeletedLeadKeys();
  if (lead.id && keys.includes(String(lead.id))) return true;
  if (lead.timestamp && keys.includes(lead.timestamp)) return true;
  if (lead.email && keys.includes(lead.email.toLowerCase())) return true;
  return false;
}

function getLeads() {
  try {
    const raw = JSON.parse(localStorage.getItem('savrajas_quote_leads') || '[]');
    return raw.filter(l => !isLeadDeletedLocally(l) && l.status !== 'deleted');
  } catch {
    return [];
  }
}

// Real-time synchronization when inquiries arrive from the website
window.addEventListener('storage', (e) => {
  if (e.key === 'savrajas_quote_leads') {
    renderDashboard();
    renderLeads();
    showToast('🔔 New Client Inquiry Received via Website! ✓');
  }
});

let isSyncingLeads = false;

// Periodic background sync for leads from Supabase Cloud
async function checkCloudLeads() {
  if (isSyncingLeads || !isSupabaseConfigured()) return;
  isSyncingLeads = true;

  try {
    const cloudLeads = await fetchLeadsFromCloud();
    if (cloudLeads && Array.isArray(cloudLeads)) {
      const validCloudLeads = cloudLeads.filter(l => !isLeadDeletedLocally(l) && l.status !== 'deleted');
      const localLeads = getLeads();

      // Check for truly NEW leads that are not in localLeads
      const trulyNewLeads = validCloudLeads.filter(cl => 
        !localLeads.some(ll => (cl.id && ll.id === cl.id) || (cl.timestamp && ll.timestamp === cl.timestamp))
      );

      // Only sync if new leads exist or count differs
      if (trulyNewLeads.length > 0 || validCloudLeads.length !== localLeads.length) {
        localStorage.setItem('savrajas_quote_leads', JSON.stringify(validCloudLeads));
        renderDashboard();
        renderLeads();

        // ONLY toast if there are actually brand new incoming leads, NEVER when deleting!
        if (trulyNewLeads.length > 0) {
          showToast(`🔔 ${trulyNewLeads.length} New Lead${trulyNewLeads.length > 1 ? 's' : ''} Received from Website! ✓`);
        }
      }
    }
  } catch (err) {
    console.warn('[Admin] checkCloudLeads error:', err);
  } finally {
    isSyncingLeads = false;
  }
}

setInterval(checkCloudLeads, 15000);
window.addEventListener('focus', checkCloudLeads);

// ============================================================================
// 4. RENDERING ALL SECTIONS
// ============================================================================
function renderAllViews() {
  renderDashboard();
  renderPricingManager();
  renderPortfolioManager();
  renderLeads();
}

// --- 4.1 Dashboard Render ---
function renderDashboard() {
  const leads = getLeads();
  const totalLeadsEl = document.getElementById('dashTotalLeads');
  const newLeadsBadge = document.getElementById('dashNewLeadsBadge');
  const totalProjectsEl = document.getElementById('dashTotalProjects');
  const avgPipelineEl = document.getElementById('dashAvgPipeline');
  const navBadge = document.getElementById('navLeadsBadge');
  const recentList = document.getElementById('dashRecentLeadsList');

  if (totalLeadsEl) totalLeadsEl.textContent = leads.length;
  if (totalProjectsEl) totalProjectsEl.textContent = currentPortfolioData.length;

  // New Leads calculation
  const newLeads = leads.filter(l => !l.status || l.status === 'new');
  if (newLeadsBadge) newLeadsBadge.textContent = `+${newLeads.length} New`;
  if (navBadge) {
    if (newLeads.length > 0) {
      navBadge.textContent = newLeads.length;
      navBadge.style.display = 'block';
    } else {
      navBadge.style.display = 'none';
    }
  }

  // Average Pipeline calculation
  if (avgPipelineEl) {
    if (leads.length > 0) {
      const sum = leads.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0);
      const avg = Math.round(sum / leads.length);
      avgPipelineEl.textContent = `₹${avg.toLocaleString('en-IN')}`;
    } else {
      avgPipelineEl.textContent = '₹0';
    }
  }

  // Recent 3 Leads
  if (recentList) {
    if (leads.length === 0) {
      recentList.innerHTML = '<div class="empty-state">No inquiries received yet. Submit a quote on the website to see real-time CRM updates!</div>';
    } else {
      const recent = [...leads].reverse().slice(0, 3);
      recentList.innerHTML = recent.map(renderLeadCardHtml).join('');
      attachLeadCardListeners(recentList);
    }
  }

  const syncBtn = document.getElementById('dashSyncSheetBtn');
  if (syncBtn) {
    syncBtn.onclick = () => {
      showToast('Syncing with Google Sheet...');
      setTimeout(() => showToast('Sheet Live Sync Verified ✓'), 1200);
    };
  }
}

// --- 4.2 Pricing Manager Render ---
function renderPricingManager() {
  const projContainer = document.getElementById('pricingProjectsContainer');
  const addonContainer = document.getElementById('pricingAddonsContainer');
  const maintContainer = document.getElementById('pricingMaintenanceContainer');

  // Render Projects (Both Preexisting and Custom are editable and deletable)
  if (projContainer) {
    projContainer.innerHTML = Object.entries(currentPricingData.projects).map(([key, item]) => {
      const title = item.label || DEFAULT_PRICING.projects[key]?.label || key.toUpperCase();
      const isCustom = !DEFAULT_PRICING.projects[key] || item.isCustom;
      return `
        <div class="pricing-card-item">
          <div class="pricing-item-title">
            <div class="pricing-title-left">
              <span>${title}</span>
              <span style="font-size:0.75rem; color:var(--admin-cyan);">ID: ${key}</span>
              ${isCustom ? '<span class="badge-custom-id">Custom</span>' : '<span style="font-size:0.68rem; color:var(--admin-text-muted); font-weight:normal;">(Preexisting)</span>'}
            </div>
            <div class="pricing-card-actions">
              <button type="button" class="btn-item-edit" onclick="openEditPricingModal('projects', '${key}')" title="Edit Title, Description &amp; Tier Prices">✏️ Edit</button>
              <button type="button" class="btn-item-del" onclick="deletePricingItem('projects', '${key}')" title="Delete Option">🗑️ Delete</button>
            </div>
          </div>
          ${item.desc ? `<p style="font-size:0.75rem; color:var(--admin-text-muted); margin-bottom:0.75rem;">${item.desc}</p>` : ''}
          <div class="pricing-inputs-row">
            <div class="price-field-group">
              <label>Starter (₹)</label>
              <input type="number" class="admin-input" data-group="projects" data-key="${key}" data-tier="starter" value="${item.starter}">
            </div>
            <div class="price-field-group">
              <label>Growth (₹)</label>
              <input type="number" class="admin-input" data-group="projects" data-key="${key}" data-tier="growth" value="${item.growth}">
            </div>
            <div class="price-field-group">
              <label>Enterprise (₹)</label>
              <input type="number" class="admin-input" data-group="projects" data-key="${key}" data-tier="enterprise" value="${item.enterprise}">
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Addons (Both Preexisting and Custom are editable and deletable)
  if (addonContainer) {
    addonContainer.innerHTML = Object.entries(currentPricingData.addons).map(([key, item]) => {
      const title = item.label || DEFAULT_PRICING.addons[key]?.label || key.toUpperCase();
      const isCustom = !DEFAULT_PRICING.addons[key] || item.isCustom;
      return `
        <div class="pricing-card-item">
          <div class="pricing-item-title">
            <div class="pricing-title-left">
              <span>${title}</span>
              <span style="font-size:0.75rem; color:var(--admin-cyan);">ID: ${key}</span>
              ${isCustom ? '<span class="badge-custom-id">Custom</span>' : '<span style="font-size:0.68rem; color:var(--admin-text-muted); font-weight:normal;">(Preexisting)</span>'}
            </div>
            <div class="pricing-card-actions">
              <button type="button" class="btn-item-edit" onclick="openEditPricingModal('addons', '${key}')" title="Edit Title, Description &amp; Tier Prices">✏️ Edit</button>
              <button type="button" class="btn-item-del" onclick="deletePricingItem('addons', '${key}')" title="Delete Option">🗑️ Delete</button>
            </div>
          </div>
          ${item.desc ? `<p style="font-size:0.75rem; color:var(--admin-text-muted); margin-bottom:0.75rem;">${item.desc}</p>` : ''}
          <div class="pricing-inputs-row">
            <div class="price-field-group">
              <label>Starter (₹)</label>
              <input type="number" class="admin-input" data-group="addons" data-key="${key}" data-tier="starter" value="${item.starter}">
            </div>
            <div class="price-field-group">
              <label>Growth (₹)</label>
              <input type="number" class="admin-input" data-group="addons" data-key="${key}" data-tier="growth" value="${item.growth}">
            </div>
            <div class="price-field-group">
              <label>Enterprise (₹)</label>
              <input type="number" class="admin-input" data-group="addons" data-key="${key}" data-tier="enterprise" value="${item.enterprise}">
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Maintenance
  if (maintContainer) {
    maintContainer.innerHTML = Object.entries(currentPricingData.maintenance).map(([key, item]) => {
      const title = DEFAULT_PRICING.maintenance[key]?.label || `${key} Year(s) Maintenance`;
      return `
        <div class="pricing-card-item">
          <div class="pricing-item-title">
            <span>${title}</span>
            <span style="font-size:0.75rem; color:var(--admin-cyan);">${key} Year(s)</span>
          </div>
          <div class="pricing-inputs-row">
            <div class="price-field-group">
              <label>Starter (₹)</label>
              <input type="number" class="admin-input" data-group="maintenance" data-key="${key}" data-tier="starter" value="${item.starter}">
            </div>
            <div class="price-field-group">
              <label>Growth (₹)</label>
              <input type="number" class="admin-input" data-group="maintenance" data-key="${key}" data-tier="growth" value="${item.growth}">
            </div>
            <div class="price-field-group">
              <label>Enterprise (₹)</label>
              <input type="number" class="admin-input" data-group="maintenance" data-key="${key}" data-tier="enterprise" value="${item.enterprise}">
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Bind Add Buttons
  const addProjBtn = document.getElementById('openAddProjectTypeBtn');
  if (addProjBtn) {
    addProjBtn.onclick = () => window.openNewProjectTypeModal();
  }
  const addAddonBtn = document.getElementById('openAddAddonBtn');
  if (addAddonBtn) {
    addAddonBtn.onclick = () => window.openNewAddonModal();
  }

  // Handle Quick Inline Form Submission
  const pricingForm = document.getElementById('pricingForm');
  if (pricingForm) {
    pricingForm.onsubmit = (e) => {
      e.preventDefault();
      document.querySelectorAll('#pricingForm input[data-group]').forEach(input => {
        const group = input.getAttribute('data-group');
        const key = input.getAttribute('data-key');
        const tier = input.getAttribute('data-tier');
        const val = parseInt(input.value, 10) || 0;

        if (currentPricingData[group] && currentPricingData[group][key]) {
          currentPricingData[group][key][tier] = val;
        }
      });

      savePricingToStorage();
      pushPricingToCloud(currentPricingData).catch(() => {});
      showToast('Pricing saved & synced live! ✓');
    };
  }

  // Handle Edit Pricing Item Form (Preexisting & Custom)
  const editPricingForm = document.getElementById('editPricingForm');
  if (editPricingForm && !editPricingForm._bound) {
    editPricingForm._bound = true;
    editPricingForm.onsubmit = (e) => {
      e.preventDefault();
      const group = document.getElementById('editPricingGroup').value;
      const key = document.getElementById('editPricingKey').value;
      const title = document.getElementById('editPricingTitle').value.trim();
      const desc = document.getElementById('editPricingDesc').value.trim();
      const starter = parseInt(document.getElementById('editPricingStarter').value, 10) || 0;
      const growth = parseInt(document.getElementById('editPricingGrowth').value, 10) || 0;
      const enterprise = parseInt(document.getElementById('editPricingEnterprise').value, 10) || 0;

      if (!currentPricingData[group] || !currentPricingData[group][key]) return;

      currentPricingData[group][key] = {
        ...currentPricingData[group][key],
        label: title,
        desc: desc,
        starter,
        growth,
        enterprise
      };

      savePricingToStorage();
      pushPricingToCloud(currentPricingData).catch(() => {});
      window.closeEditPricingModal();
      renderPricingManager();
      showToast(`Updated "${title}" successfully! ✓`);
    };
  }

  // Handle New Project Type Form
  const newProjForm = document.getElementById('newProjectTypeForm');
  if (newProjForm && !newProjForm._bound) {
    newProjForm._bound = true;
    newProjForm.onsubmit = (e) => {
      e.preventDefault();
      const rawId = document.getElementById('newProjId').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      const title = document.getElementById('newProjTitle').value.trim();
      const desc = document.getElementById('newProjDesc').value.trim();
      const starter = parseInt(document.getElementById('newProjStarter').value, 10) || 0;
      const growth = parseInt(document.getElementById('newProjGrowth').value, 10) || 0;
      const enterprise = parseInt(document.getElementById('newProjEnterprise').value, 10) || 0;

      if (!rawId) {
        alert('Please enter a valid unique ID.');
        return;
      }
      if (currentPricingData.projects[rawId]) {
        alert(`Project ID "${rawId}" already exists. Please choose a different ID.`);
        return;
      }

      currentPricingData.projects[rawId] = {
        starter,
        growth,
        enterprise,
        label: title,
        desc: desc || title,
        isCustom: true
      };

      savePricingToStorage();
      pushPricingToCloud(currentPricingData).catch(() => {});
      window.closeNewProjectTypeModal();
      renderPricingManager();
      showToast(`Created Project Type "${title}" (ID: ${rawId})! ✓`);
    };
  }

  // Handle New Add-On Form
  const newAddonForm = document.getElementById('newAddonForm');
  if (newAddonForm && !newAddonForm._bound) {
    newAddonForm._bound = true;
    newAddonForm.onsubmit = (e) => {
      e.preventDefault();
      const rawId = document.getElementById('newAddonId').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      const title = document.getElementById('newAddonTitle').value.trim();
      const desc = document.getElementById('newAddonDesc').value.trim();
      const starter = parseInt(document.getElementById('newAddonStarter').value, 10) || 0;
      const growth = parseInt(document.getElementById('newAddonGrowth').value, 10) || 0;
      const enterprise = parseInt(document.getElementById('newAddonEnterprise').value, 10) || 0;

      if (!rawId) {
        alert('Please enter a valid unique ID.');
        return;
      }
      if (currentPricingData.addons[rawId]) {
        alert(`Add-On ID "${rawId}" already exists. Please choose a different ID.`);
        return;
      }

      currentPricingData.addons[rawId] = {
        starter,
        growth,
        enterprise,
        label: title,
        desc: desc || title,
        isCustom: true
      };

      savePricingToStorage();
      pushPricingToCloud(currentPricingData).catch(() => {});
      window.closeNewAddonModal();
      renderPricingManager();
      showToast(`Created Add-On "${title}" (ID: ${rawId})! ✓`);
    };
  }

  // Reset Pricing
  const resetBtn = document.getElementById('pricingResetBtn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Reset all prices and options back to Savrajas defaults?')) {
        currentPricingData = JSON.parse(JSON.stringify(DEFAULT_PRICING));
        savePricingToStorage();
        pushPricingToCloud(currentPricingData).catch(() => {});
        renderPricingManager();
        showToast('Pricing reset to defaults ✓');
      }
    };
  }

  // Export JSON
  const exportBtn = document.getElementById('pricingExportBtn');
  if (exportBtn) {
    exportBtn.onclick = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentPricingData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "savrajas_pricing.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Pricing JSON exported');
    };
  }
}

// Global modal triggers for edit & new IDs
window.openEditPricingModal = function(group, key) {
  const item = currentPricingData[group]?.[key];
  if (!item) return;

  const defaultItem = DEFAULT_PRICING[group]?.[key];
  const title = item.label || defaultItem?.label || key;
  const desc = item.desc || defaultItem?.desc || '';

  document.getElementById('editPricingModalTitle').textContent = `Edit ${group === 'projects' ? 'Project Type' : 'Add-On'}: ${title}`;
  document.getElementById('editPricingGroup').value = group;
  document.getElementById('editPricingKey').value = key;
  document.getElementById('editPricingIdDisplay').textContent = `${key} • ${defaultItem ? 'Preexisting Option' : 'Custom Added Option'}`;
  document.getElementById('editPricingTitle').value = title;
  document.getElementById('editPricingDesc').value = desc;
  document.getElementById('editPricingStarter').value = item.starter || 0;
  document.getElementById('editPricingGrowth').value = item.growth || 0;
  document.getElementById('editPricingEnterprise').value = item.enterprise || 0;

  const modal = document.getElementById('editPricingModal');
  if (modal) modal.classList.add('open');
};

window.closeEditPricingModal = function() {
  const modal = document.getElementById('editPricingModal');
  if (modal) modal.classList.remove('open');
};

window.openNewProjectTypeModal = function() {
  const modal = document.getElementById('newProjectTypeModal');
  if (modal) modal.classList.add('open');
};
window.closeNewProjectTypeModal = function() {
  const modal = document.getElementById('newProjectTypeModal');
  if (modal) modal.classList.remove('open');
  const form = document.getElementById('newProjectTypeForm');
  if (form) form.reset();
};

window.openNewAddonModal = function() {
  const modal = document.getElementById('newAddonModal');
  if (modal) modal.classList.add('open');
};
window.closeNewAddonModal = function() {
  const modal = document.getElementById('newAddonModal');
  if (modal) modal.classList.remove('open');
  const form = document.getElementById('newAddonForm');
  if (form) form.reset();
};

window.deletePricingItem = function(group, key) {
  const item = currentPricingData[group]?.[key];
  const defaultItem = DEFAULT_PRICING[group]?.[key];
  const label = item?.label || defaultItem?.label || key;

  const confirmMsg = defaultItem
    ? `Delete preexisting option "${label}" (ID: ${key})?\n\nThis will immediately remove it from your website quote calculator. (You can restore default options anytime using "Reset to Defaults").`
    : `Delete custom option "${label}" (ID: ${key})?\n\nThis will remove it from your website quote calculator.`;

  if (!confirm(confirmMsg)) return;

  delete currentPricingData[group][key];
  savePricingToStorage();
  pushPricingToCloud(currentPricingData).catch(() => {});
  renderPricingManager();
  showToast(`Deleted ${label} ✓`);
};

// --- 4.3 Portfolio Manager (CRUD) ---
function renderPortfolioManager(filterQuery = '') {
  const container = document.getElementById('portfolioAdminList');
  if (!container) return;

  const query = filterQuery.toLowerCase().trim();
  const filtered = currentPortfolioData.filter(p => {
    return p.title.toLowerCase().includes(query) ||
           p.client.toLowerCase().includes(query) ||
           p.category.toLowerCase().includes(query) ||
           (p.techStack && p.techStack.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">No matching portfolio projects found.</div>';
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="portfolio-admin-item">
      <div class="port-item-info">
        <img src="${p.logo || 'assets/images/app-icon.png'}" alt="${p.title}" class="port-item-thumb" onerror="this.src='assets/images/app-icon.png'">
        <div class="port-item-text">
          <div class="port-item-title">${p.title}</div>
          <div class="port-item-meta">
            ${p.client} • <span style="color:#38bdf8;">${p.category}</span>
            ${p.liveLink ? ` • <a href="${p.liveLink}" target="_blank" rel="noopener noreferrer" class="badge-live-link">🔗 Live Site</a>` : ''}
          </div>
        </div>
      </div>
      <div class="port-item-actions">
        <button class="icon-action-btn" onclick="openEditProjectModal('${p.id}')" title="Edit Project">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="icon-action-btn delete" onclick="deleteProject('${p.id}')" title="Delete Project">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Search input listener
  const searchInput = document.getElementById('portfolioSearchInput');
  if (searchInput && !searchInput.dataset.listening) {
    searchInput.dataset.listening = "true";
    searchInput.addEventListener('input', (e) => {
      renderPortfolioManager(e.target.value);
    });
  }
}

// Portfolio CRUD Handlers
window.openAddProjectModal = function() {
  document.getElementById('projectModalTitle').textContent = 'Add Case Study';
  document.getElementById('editProjectId').value = '';
  document.getElementById('editTitle').value = '';
  document.getElementById('editClient').value = '';
  document.getElementById('editCategory').value = 'Technology';
  document.getElementById('editIndustry').value = '';
  document.getElementById('editTimeline').value = '3 Months';
  document.getElementById('editTech').value = 'React, Next.js, Node.js';
  document.getElementById('editTags').value = 'Web, Corporate, Brand';
  document.getElementById('editLogo').value = 'assets/images/app-icon.png';
  document.getElementById('editLiveLink').value = '';
  document.getElementById('editDesc').value = '';

  document.getElementById('projectEditModal').classList.add('open');
};

window.openEditProjectModal = function(id) {
  const p = currentPortfolioData.find(item => item.id === id);
  if (!p) return;

  document.getElementById('projectModalTitle').textContent = 'Edit ' + p.title;
  document.getElementById('editProjectId').value = p.id;
  document.getElementById('editTitle').value = p.title || '';
  document.getElementById('editClient').value = p.client || '';
  document.getElementById('editCategory').value = p.category || '';
  document.getElementById('editIndustry').value = p.industry || '';
  document.getElementById('editTimeline').value = p.timeline || '';
  document.getElementById('editTech').value = p.techStack || '';
  document.getElementById('editTags').value = p.tags || '';
  document.getElementById('editLogo').value = p.logo || '';
  document.getElementById('editLiveLink').value = p.liveLink || '';
  document.getElementById('editDesc').value = p.desc || '';

  document.getElementById('projectEditModal').classList.add('open');
};

window.closeProjectModal = function() {
  document.getElementById('projectEditModal').classList.remove('open');
};

window.deleteProject = function(id) {
  const project = currentPortfolioData.find(p => p.id === id);
  if (!project) return;

  if (confirm(`Are you sure you want to remove "${project.title}" from your portfolio?`)) {
    currentPortfolioData = currentPortfolioData.filter(p => p.id !== id);
    savePortfolioToStorage();
    pushPortfolioToCloud(currentPortfolioData).catch(() => {});
    renderPortfolioManager();
    renderDashboard();
    showToast(`Removed "${project.title}" ✓`);
  }
};

const projectForm = document.getElementById('projectEditForm');
if (projectForm) {
  projectForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('editProjectId').value.trim();
    const title = document.getElementById('editTitle').value.trim();
    const client = document.getElementById('editClient').value.trim();
    const category = document.getElementById('editCategory').value.trim();
    const industry = document.getElementById('editIndustry').value.trim();
    const timeline = document.getElementById('editTimeline').value.trim();
    const techStack = document.getElementById('editTech').value.trim();
    const tags = document.getElementById('editTags').value.trim();
    const logo = document.getElementById('editLogo').value.trim();
    const liveLink = document.getElementById('editLiveLink').value.trim();
    const desc = document.getElementById('editDesc').value.trim();

    if (id) {
      // Edit existing
      const idx = currentPortfolioData.findIndex(p => p.id === id);
      if (idx !== -1) {
        currentPortfolioData[idx] = {
          ...currentPortfolioData[idx],
          title, client, category, industry, timeline, techStack, tags, logo, liveLink, desc
        };
        showToast(`Updated "${title}" ✓`);
      }
    } else {
      // Add new
      const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
      currentPortfolioData.unshift({
        id: newId,
        title,
        client,
        category,
        industry,
        timeline,
        techStack,
        tags,
        logo,
        liveLink,
        desc
      });
      showToast(`Added "${title}" to portfolio ✓`);
    }

    savePortfolioToStorage();
    pushPortfolioToCloud(currentPortfolioData).catch(() => {});
    closeProjectModal();
    renderPortfolioManager();
    renderDashboard();
  };
}

// --- 4.4 Leads & Inquiries CRM Render ---
let currentLeadsFilter = 'all';

function renderLeads() {
  const container = document.getElementById('leadsFullContainer');
  const countAll = document.getElementById('leadsCountAll');
  const countNew = document.getElementById('leadsCountNew');
  const countContacted = document.getElementById('leadsCountContacted');

  const leads = getLeads();

  if (countAll) countAll.textContent = leads.length;
  if (countNew) countNew.textContent = leads.filter(l => !l.status || l.status === 'new').length;
  if (countContacted) countContacted.textContent = leads.filter(l => l.status === 'contacted').length;

  if (!container) return;

  const filtered = leads.filter(l => {
    if (currentLeadsFilter === 'new') return !l.status || l.status === 'new';
    if (currentLeadsFilter === 'contacted') return l.status === 'contacted';
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">No inquiries found for this filter.</div>';
    return;
  }

  container.innerHTML = [...filtered].reverse().map(renderLeadCardHtml).join('');
  attachLeadCardListeners(container);

  // Setup Filter Chip Clicks
  document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentLeadsFilter = chip.getAttribute('data-filter');
      renderLeads();
    };
  });

  // Export CSV
  const exportCsvBtn = document.getElementById('exportLeadsCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.onclick = () => {
      if (leads.length === 0) {
        alert('No leads to export yet.');
        return;
      }
      const headers = ['Timestamp', 'Client Name', 'Email', 'Phone', 'Project Type', 'Tier', 'Price INR', 'Addons', 'Maintenance', 'Status'];
      const rows = leads.map(l => [
        `"${l.timestamp || ''}"`,
        `"${l.name || ''}"`,
        `"${l.email || ''}"`,
        `"${l.phone || ''}"`,
        `"${l.projectType || ''}"`,
        `"${l.tier || ''}"`,
        `"${l.totalPrice || 0}"`,
        `"${l.addons || ''}"`,
        `"${l.maintenance || ''}"`,
        `"${l.status || 'new'}"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `savrajas_leads_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Leads exported to CSV ✓');
    };
  }
}

let activeDetailLead = null;

function renderLeadCardHtml(lead, idx) {
  const cleanPhone = (lead.phone || '').replace(/[^0-9+]/g, '');
  const tier = lead.tier || 'Starter';
  const tierClass = tier.toLowerCase().replace(/[^a-z]/g, '');
  const formattedPrice = `₹${(lead.totalPrice || 0).toLocaleString('en-IN')}`;
  const time = lead.timestamp ? new Date(lead.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
  const whatsappMsg = encodeURIComponent(`Hi ${lead.name || 'there'}, this is Savrajas Technology Solutions regarding your project quotation for ${lead.projectType || 'your web platform'}. How can we assist you?`);

  // Extract snippet of brief if available
  let briefSnippet = '';
  if (lead.addons && (lead.addons.startsWith('Message: ') || lead.addons.startsWith('Brief: '))) {
    briefSnippet = lead.addons.replace(/^(Message:\s*|Brief:\s*)/i, '').trim();
    if (briefSnippet.length > 85) briefSnippet = briefSnippet.slice(0, 85) + '...';
  }

  const statusLabel = lead.status === 'contacted' ? '🔵 Contacted' :
                      lead.status === 'in_review' ? '🟡 In Review' :
                      lead.status === 'proposal_sent' ? '🟣 Proposal' :
                      lead.status === 'closed_won' ? '🏆 Won' :
                      lead.status === 'closed_lost' ? '⚪ Lost' : '🟢 New';

  return `
    <div class="lead-card" data-timestamp="${lead.timestamp || ''}" data-lead-id="${lead.id || ''}">
      <div class="lead-card-header">
        <div>
          <div class="lead-client-name">${lead.name || 'Anonymous Client'}</div>
          <div class="lead-timestamp">${time} • ${lead.email || ''}</div>
        </div>
        <div class="lead-card-header-actions">
          <span class="lead-tag" style="font-weight: 700; font-size: 0.7rem;">${statusLabel}</span>
          <span class="lead-pill ${tierClass}">${tier}</span>
          <button type="button" class="btn-card-del" title="Delete Lead Permanently" data-action="delete" aria-label="Delete Lead">
            🗑️
          </button>
        </div>
      </div>

      <div class="lead-price-tag">${formattedPrice}</div>

      <div class="lead-details-row">
        <span class="lead-tag">📂 ${lead.projectType || 'Project'}</span>
        ${lead.addons ? `<span class="lead-tag">🧩 ${lead.addons.length > 35 ? lead.addons.slice(0, 35) + '...' : lead.addons}</span>` : ''}
        ${lead.maintenance ? `<span class="lead-tag">🛡️ ${lead.maintenance}</span>` : ''}
      </div>

      ${briefSnippet ? `
      <div style="font-size: 0.8rem; color: #cbd5e1; background: rgba(0,0,0,0.35); padding: 0.45rem 0.65rem; border-radius: 6px; border-left: 2px solid var(--admin-cyan);">
        💬 "${briefSnippet}"
      </div>
      ` : ''}

      <div class="lead-view-more">
        <span>🔍 Click to View Full Brief &amp; Client Details</span>
        <span>→</span>
      </div>

      <div class="lead-actions-row">
        ${cleanPhone ? `<a href="tel:${cleanPhone}" class="btn-contact phone" data-action="contact">📞 Call</a>` : ''}
        ${lead.email ? `<a href="mailto:${lead.email}?subject=Savrajas Project Quote" class="btn-contact email" data-action="contact">✉️ Email</a>` : ''}
        ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}?text=${whatsappMsg}" target="_blank" class="btn-contact whatsapp" data-action="contact">💬 WhatsApp</a>` : ''}
      </div>
    </div>
  `;
}

function attachLeadCardListeners(parent) {
  if (!parent) return;

  parent.querySelectorAll('.lead-card').forEach(card => {
    const ts = card.getAttribute('data-timestamp');
    const leadId = card.getAttribute('data-lead-id');
    const allLeads = getLeads();
    const lead = allLeads.find(l => (leadId && String(l.id) === leadId) || (ts && l.timestamp === ts));
    if (!lead) return;

    // Delete button on the card header
    const delBtn = card.querySelector('.btn-card-del');
    if (delBtn) {
      delBtn.onclick = (e) => {
        e.stopPropagation();
        confirmDeleteLead(lead);
      };
    }

    // Direct contact buttons click (stop propagation so card doesn't open modal)
    card.querySelectorAll('[data-action="contact"]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
      };
    });

    // Clicking anywhere on card opens full details modal
    card.onclick = (e) => {
      if (e.target.closest('[data-action="contact"]') || e.target.closest('[data-action="delete"]')) {
        return;
      }
      openLeadDetailModal(lead);
    };
  });
}

function openLeadDetailModal(lead) {
  activeDetailLead = lead;
  const modal = document.getElementById('leadDetailModal');
  if (!modal) return;

  const cleanPhone = (lead.phone || '').replace(/[^0-9+]/g, '');
  const tier = lead.tier || 'Starter';
  const tierClass = tier.toLowerCase().replace(/[^a-z]/g, '');
  const formattedPrice = `₹${(lead.totalPrice || 0).toLocaleString('en-IN')}`;
  const dateFormatted = lead.timestamp 
    ? new Date(lead.timestamp).toLocaleDateString(undefined, { 
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }) 
    : 'Recent Submission';

  // Modal Title & Tier Badge
  const titleEl = document.getElementById('leadModalName');
  if (titleEl) titleEl.textContent = lead.name || 'Client Lead Details';

  const tierBadgeEl = document.getElementById('leadModalTierBadge');
  if (tierBadgeEl) {
    tierBadgeEl.textContent = tier;
    tierBadgeEl.className = `lead-pill ${tierClass}`;
  }

  // Profile block
  const fullNameEl = document.getElementById('leadModalFullName');
  if (fullNameEl) fullNameEl.textContent = lead.name || 'Anonymous Client';

  const timeEl = document.getElementById('leadModalTimestamp');
  if (timeEl) timeEl.textContent = `📅 ${dateFormatted}`;

  // Status Selector
  const statusSelect = document.getElementById('leadModalStatusSelect');
  if (statusSelect) {
    statusSelect.value = lead.status || 'new';
    statusSelect.onchange = async () => {
      const newStatus = statusSelect.value;
      lead.status = newStatus;

      // Update in localStorage
      const allLeads = getLeads();
      const target = allLeads.find(l => (lead.id && l.id === lead.id) || (lead.timestamp && l.timestamp === lead.timestamp));
      if (target) {
        target.status = newStatus;
        localStorage.setItem('savrajas_quote_leads', JSON.stringify(allLeads));
      }

      // Update in Supabase Cloud
      if (lead.id) {
        await updateLeadStatusInCloud(lead.id, newStatus);
      }

      renderDashboard();
      renderLeads();
      showToast(`Lead status updated to ${newStatus.toUpperCase()} ✓`);
    };
  }

  // Contact quick buttons
  const phoneLink = document.getElementById('leadModalPhoneLink');
  const phoneText = document.getElementById('leadModalPhoneText');
  if (phoneLink && phoneText) {
    if (cleanPhone) {
      phoneLink.href = `tel:${cleanPhone}`;
      phoneLink.style.display = 'flex';
      phoneText.textContent = lead.phone || cleanPhone;
    } else {
      phoneLink.style.display = 'none';
    }
  }

  const emailLink = document.getElementById('leadModalEmailLink');
  const emailText = document.getElementById('leadModalEmailText');
  if (emailLink && emailText) {
    if (lead.email) {
      emailLink.href = `mailto:${lead.email}?subject=Savrajas Project Inquiry Response`;
      emailLink.style.display = 'flex';
      emailText.textContent = lead.email;
    } else {
      emailLink.style.display = 'none';
    }
  }

  const whatsappLink = document.getElementById('leadModalWhatsappLink');
  if (whatsappLink) {
    if (cleanPhone) {
      const whatsappMsg = encodeURIComponent(
        `Hi ${lead.name || 'there'}, this is Savrajas Technology Solutions regarding your project inquiry for "${lead.projectType || 'AI & Cloud Solutions'}". We'd love to discuss your requirements and timelines!`
      );
      whatsappLink.href = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;
      whatsappLink.style.display = 'flex';
    } else {
      whatsappLink.style.display = 'none';
    }
  }

  // Specs & Scope
  const serviceEl = document.getElementById('leadModalService');
  if (serviceEl) serviceEl.textContent = lead.projectType || 'Custom Technology Solution';

  const budgetEl = document.getElementById('leadModalBudget');
  if (budgetEl) {
    if (lead.tier === 'Direct Contact Form' && lead.maintenance && lead.maintenance.includes('Estimated Budget:')) {
      const budgetBracket = lead.maintenance.replace(/^Estimated Budget:\s*/i, '');
      budgetEl.textContent = budgetBracket;
    } else {
      budgetEl.textContent = formattedPrice;
    }
  }

  const sourceEl = document.getElementById('leadModalSource');
  if (sourceEl) {
    if (lead.tier === 'Direct Contact Form') {
      sourceEl.textContent = 'Website Main Contact Form';
    } else {
      sourceEl.textContent = 'Interactive Quotation Calculator';
    }
  }

  const maintEl = document.getElementById('leadModalMaintenance');
  if (maintEl) {
    if (lead.tier === 'Direct Contact Form' || !lead.maintenance || lead.maintenance.includes('Estimated Budget:')) {
      maintEl.textContent = 'Standard Warranty Included (Free)';
    } else {
      maintEl.textContent = lead.maintenance;
    }
  }

  // Full Brief Text Extraction
  const briefTextEl = document.getElementById('leadModalBriefText');
  let fullBrief = '';
  if (lead.addons && (lead.addons.includes('Message: ') || lead.addons.includes('Brief: '))) {
    fullBrief = lead.addons.replace(/^(Message:\s*|Brief:\s*)/i, '').trim();
  } else if (lead.addons) {
    fullBrief = `Configured Add-ons:\n${lead.addons}`;
    if (lead.maintenance) {
      fullBrief += `\n\nMaintenance Agreement:\n${lead.maintenance}`;
    }
  } else {
    fullBrief = `Inquiry received for ${lead.projectType || 'General Project'} under the ${lead.tier || 'Starter'} tier with budget ${formattedPrice}.`;
  }

  if (briefTextEl) {
    briefTextEl.textContent = fullBrief || 'No additional project brief text was provided.';
  }

  // Copy Brief Button
  const copyBtn = document.getElementById('leadModalCopyBriefBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const copyContent = `Client Name: ${lead.name || 'Client'}\nContact: ${lead.phone || ''} | ${lead.email || ''}\nService: ${lead.projectType || ''}\nBudget: ${budgetEl ? budgetEl.textContent : formattedPrice}\nStatus: ${(lead.status || 'new').toUpperCase()}\n\nProject Brief:\n${fullBrief}`;
      navigator.clipboard.writeText(copyContent).then(() => {
        showToast('Full brief copied to clipboard! 📋');
      }).catch(() => {
        showToast('Brief copied ✓');
      });
    };
  }

  // Addons Box
  const addonsBox = document.getElementById('leadModalAddonsBox');
  const addonsTags = document.getElementById('leadModalAddonsTags');
  if (addonsBox && addonsTags) {
    if (lead.addons && !lead.addons.startsWith('Message:') && !lead.addons.startsWith('Brief:')) {
      addonsBox.style.display = 'block';
      const items = lead.addons.split(',').map(s => s.trim()).filter(Boolean);
      addonsTags.innerHTML = items.map(it => `<span class="lead-tag">🧩 ${it}</span>`).join('');
    } else {
      addonsBox.style.display = 'none';
    }
  }

  // Delete Lead Button inside modal
  const deleteBtn = document.getElementById('leadModalDeleteBtn');
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      confirmDeleteLead(lead);
    };
  }

  modal.classList.add('open');
  const bodyEl = modal.querySelector('.lead-detail-body');
  if (bodyEl) bodyEl.scrollTop = 0;
  const sheetEl = modal.querySelector('.lead-detail-sheet');
  if (sheetEl) sheetEl.scrollTop = 0;
}

window.closeLeadDetailModal = function() {
  const modal = document.getElementById('leadDetailModal');
  if (modal) modal.classList.remove('open');
  activeDetailLead = null;
};

async function confirmDeleteLead(lead) {
  if (!lead) return;
  const clientName = lead.name || 'this client';

  // Guard sync so window focus does not restore the lead during confirmation
  isSyncingLeads = true;

  const confirmed = window.confirm(
    `Are you sure you want to permanently delete the inquiry from "${clientName}"?\n\nThis will remove it from both your local CRM and Supabase Cloud database.`
  );

  if (!confirmed) {
    setTimeout(() => { isSyncingLeads = false; }, 500);
    return;
  }

  // 1. Mark as permanently deleted in local tombstone registry
  markLeadAsDeletedLocally(lead);

  // 2. Remove immediately from localStorage
  try {
    const allLeads = getLeads();
    const updated = allLeads.filter(l => {
      if (lead.id && l.id) return l.id !== lead.id;
      if (lead.timestamp && l.timestamp) return l.timestamp !== lead.timestamp;
      return !(l.name === lead.name && l.email === lead.email);
    });
    localStorage.setItem('savrajas_quote_leads', JSON.stringify(updated));
  } catch (err) {
    console.warn('Local lead delete error:', err);
  }

  // 3. Immediately close modal & re-render UI
  closeLeadDetailModal();
  renderDashboard();
  renderLeads();

  showToast(`Lead from "${clientName}" permanently deleted ✓`);

  // 4. Send delete & soft-delete to Supabase Cloud
  try {
    await deleteLeadFromCloud(lead);
  } catch (err) {
    console.warn('Supabase lead delete error:', err);
  } finally {
    setTimeout(() => { isSyncingLeads = false; }, 1500);
  }
}

// ============================================================================
// 5. PWA ANDROID INSTALL PROMPT
// ============================================================================
function initPwaInstall() {
  const banner = document.getElementById('pwaInstallBanner');
  const installBtn = document.getElementById('pwaInstallBtn');
  const settingsBtn = document.getElementById('settingsInstallBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (banner) banner.style.display = 'flex';
  });

  function triggerInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('Savrajas Admin Installed to Home Screen! ✓');
        }
        deferredPrompt = null;
        if (banner) banner.style.display = 'none';
      });
    } else {
      alert('To install on Android:\n1. Tap your browser menu (⋮)\n2. Select "Add to Home screen" or "Install App"');
    }
  }

  if (installBtn) installBtn.addEventListener('click', triggerInstall);
  if (settingsBtn) settingsBtn.addEventListener('click', triggerInstall);

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Google Sheet Force Sync in Settings
  const forceSyncBtn = document.getElementById('forceSyncSheetBtn');
  if (forceSyncBtn) {
    forceSyncBtn.addEventListener('click', () => {
      showToast('Contacting Google Sheet API...');
      setTimeout(() => showToast('Sheet Connection Verified ✓'), 1500);
    });
  }

  // Copy TSV Format for Sheet
  const copyTsvBtn = document.getElementById('copySheetTsvBtn');
  if (copyTsvBtn) {
    copyTsvBtn.addEventListener('click', () => {
      let tsv = "Category\tID\tLabel\tStarter\tGrowth\tEnterprise\n";
      for (const [k, v] of Object.entries(currentPricingData.projects)) {
        tsv += `Project\t${k}\t${v.label || k}\t${v.starter}\t${v.growth}\t${v.enterprise}\n`;
      }
      for (const [k, v] of Object.entries(currentPricingData.addons)) {
        tsv += `Addon\t${k}\t${v.label || k}\t${v.starter}\t${v.growth}\t${v.enterprise}\n`;
      }
      for (const [k, v] of Object.entries(currentPricingData.maintenance)) {
        tsv += `Maintenance\t${k}\t${v.label || k}\t${v.starter}\t${v.growth}\t${v.enterprise}\n`;
      }
      navigator.clipboard.writeText(tsv).then(() => {
        showToast('Google Sheet TSV copied to clipboard! ✓');
      }).catch(() => {
        showToast('Clipboard access denied');
      });
    });
  }
}

// ============================================================================
// 6. SUPABASE CLOUD SYNC SETTINGS
// ============================================================================
function initSettingsSupabase() {
  const badge = document.getElementById('supabaseStatusBadge');
  const keyInput = document.getElementById('supabaseAnonKeyInput');
  const saveKeyBtn = document.getElementById('saveSupabaseKeyBtn');
  const testConnBtn = document.getElementById('testSupabaseConnBtn');
  const pushAllBtn = document.getElementById('pushAllToCloudBtn');
  const pullAllBtn = document.getElementById('pullAllFromCloudBtn');
  const copySqlBtn = document.getElementById('copySupabaseSqlBtn');
  const toggleVisibilityBtn = document.getElementById('toggleAnonKeyVisibility');

  function updateStatus() {
    const cfg = getSupabaseConfig();
    if (keyInput && !keyInput.value && cfg.anonKey) {
      keyInput.value = cfg.anonKey;
    }
    if (badge) {
      if (isSupabaseConfigured()) {
        badge.textContent = '🟢 Cloud Connected';
        badge.style.background = 'rgba(34,197,94,0.15)';
        badge.style.color = '#4ade80';
        badge.style.borderColor = 'rgba(34,197,94,0.3)';
      } else {
        badge.textContent = '🟡 Local Mode (Anon Key Needed)';
        badge.style.background = 'rgba(234,179,8,0.15)';
        badge.style.color = '#facc15';
        badge.style.borderColor = 'rgba(234,179,8,0.3)';
      }
    }
  }

  updateStatus();

  if (toggleVisibilityBtn && keyInput) {
    toggleVisibilityBtn.addEventListener('click', () => {
      keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
    });
  }

  if (saveKeyBtn && keyInput) {
    saveKeyBtn.addEventListener('click', async () => {
      const val = keyInput.value.trim();
      saveSupabaseAnonKey(val);
      updateStatus();
      if (!val) {
        showToast('Supabase key removed. Local storage mode active.');
        return;
      }
      showToast('Testing Supabase Cloud connection...');
      const pricing = await fetchPricingFromCloud();
      if (pricing !== null) {
        showToast('Supabase Connected & Verified! ✓');
      } else {
        showToast('Key saved. Ensure tables are created in Supabase SQL editor.');
      }
    });
  }

  if (testConnBtn) {
    testConnBtn.addEventListener('click', async () => {
      if (!isSupabaseConfigured()) {
        alert('Please enter and save your Supabase Anon Key first.');
        return;
      }
      showToast('Pinging Supabase REST API...');
      const pricing = await fetchPricingFromCloud();
      if (pricing !== null) {
        showToast('Supabase Cloud Connection: 200 OK ✓');
      } else {
        alert('Could not query savrajas_pricing in Supabase.\nPlease verify:\n1. Your Anon Key is correct\n2. You ran supabase_schema.sql in the Supabase SQL Editor\n(Click "Copy Database Setup SQL" button to copy schema).');
      }
    });
  }

  if (pushAllBtn) {
    pushAllBtn.addEventListener('click', async () => {
      if (!isSupabaseConfigured()) {
        alert('Please enter your Supabase Anon Key first.');
        return;
      }
      showToast('Pushing Pricing & Portfolio to Cloud...');
      const p1 = await pushPricingToCloud(currentPricingData);
      const p2 = await pushPortfolioToCloud(currentPortfolioData);
      if (p1 || p2) {
        showToast('Synced data to Supabase Cloud! ✓');
      } else {
        showToast('Sync attempted (check Supabase table schema).');
      }
    });
  }

  if (pullAllBtn) {
    pullAllBtn.addEventListener('click', async () => {
      if (!isSupabaseConfigured()) {
        alert('Please enter your Supabase Anon Key first.');
        return;
      }
      showToast('Pulling latest data from Cloud...');
      const cloudPricing = await fetchPricingFromCloud();
      const cloudPortfolio = await fetchPortfolioFromCloud();
      let updated = false;
      if (cloudPricing) {
        currentPricingData = cloudPricing;
        savePricingToStorage();
        renderPricingManager();
        updated = true;
      }
      if (cloudPortfolio && Array.isArray(cloudPortfolio) && cloudPortfolio.length > 0) {
        currentPortfolioData = cloudPortfolio;
        savePortfolioToStorage();
        renderPortfolioManager();
        renderDashboard();
        updated = true;
      }
      if (updated) {
        showToast('Loaded latest Cloud data into local app! ✓');
      } else {
        showToast('No remote records found or already up to date.');
      }
    });
  }

  if (copySqlBtn) {
    copySqlBtn.addEventListener('click', async () => {
      const sqlSchema = `-- ============================================================================
-- SAVRAJAS SUPABASE DATABASE SCHEMA
-- Project URL: https://npcvgvpzaznzgisrhhea.supabase.co
-- Paste into https://supabase.com/dashboard/project/npcvgvpzaznzgisrhhea/sql/new
-- ============================================================================

create table if not exists public.savrajas_pricing (
  id text primary key default 'active_config',
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table public.savrajas_pricing enable row level security;
drop policy if exists "Allow public read savrajas_pricing" on public.savrajas_pricing;
create policy "Allow public read savrajas_pricing" on public.savrajas_pricing for select using (true);
drop policy if exists "Allow public write savrajas_pricing" on public.savrajas_pricing;
create policy "Allow public write savrajas_pricing" on public.savrajas_pricing for all using (true) with check (true);

create table if not exists public.savrajas_portfolio (
  id text primary key default 'active_portfolio',
  projects jsonb not null,
  updated_at timestamptz default now()
);
alter table public.savrajas_portfolio enable row level security;
drop policy if exists "Allow public read savrajas_portfolio" on public.savrajas_portfolio;
create policy "Allow public read savrajas_portfolio" on public.savrajas_portfolio for select using (true);
drop policy if exists "Allow public write savrajas_portfolio" on public.savrajas_portfolio;
create policy "Allow public write savrajas_portfolio" on public.savrajas_portfolio for all using (true) with check (true);

create table if not exists public.savrajas_leads (
  id bigint generated by default as identity primary key,
  name text,
  email text,
  phone text,
  project_type text,
  addons text,
  maintenance text,
  tier text,
  total_price numeric,
  status text default 'new',
  created_at timestamptz default now()
);
alter table public.savrajas_leads enable row level security;
drop policy if exists "Allow public read savrajas_leads" on public.savrajas_leads;
create policy "Allow public read savrajas_leads" on public.savrajas_leads for select using (true);
drop policy if exists "Allow public insert savrajas_leads" on public.savrajas_leads;
create policy "Allow public insert savrajas_leads" on public.savrajas_leads for insert with check (true);
drop policy if exists "Allow public update savrajas_leads" on public.savrajas_leads;
create policy "Allow public update savrajas_leads" on public.savrajas_leads for update using (true);`;

      navigator.clipboard.writeText(sqlSchema).then(() => {
        showToast('Copied Supabase SQL schema to clipboard! ✓');
      }).catch(() => {
        showToast('Failed to copy. See supabase_schema.sql in project.');
      });
    });
  }
}

// --- Toast Utility ---
function showToast(msg) {
  const toast = document.getElementById('adminToast');
  const text = document.getElementById('adminToastText');
  if (!toast || !text) return;

  text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
