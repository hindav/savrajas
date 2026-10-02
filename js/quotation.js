/* ==========================================================================
   SAVRAJAS QUOTATION BUILDER
   3-Step Wizard · Multilingual (EN/HI/MR) · Google Sheets Integration
   ========================================================================== */

// ---------------------------------------------------------------------------
// Google Sheets Integration Configuration
// ---------------------------------------------------------------------------
const SPREADSHEET_ID = '15qqy_WYaT-J_CEcM0qa8udl_HXuz4GMaG1_r7nfD1Sk';
const SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

// ---------------------------------------------------------------------------
// PRICING DATA (INR) — Live Synced with Google Sheet + Local Fallback
// ---------------------------------------------------------------------------
let PRICING = {
  projects: {
    showcase:  { starter: 34999,  growth: 69999,   enterprise: 149999 },
    business:  { starter: 49999,  growth: 99999,   enterprise: 199999 },
    portfolio: { starter: 39999,  growth: 59999,   enterprise: 129999 },
    ecommerce: { starter: 79999,  growth: 149999,  enterprise: 349999 },
    blog:      { starter: 34999,  growth: 49999,   enterprise: 99999 },
    landing:   { starter: 24999,  growth: 49999,   enterprise: 99999 },
  },
  addons: {
    android:  { starter: 49999,  growth: 99999,  enterprise: 199999 },
    backend:  { starter: 29999,  growth: 59999,  enterprise: 99999 },
    admin:    { starter: 39999,  growth: 79999,  enterprise: 149999 },
    payments: { starter: 19999,  growth: 39999,  enterprise: 69999 },
    chat:     { starter: 14999,  growth: 29999,  enterprise: 49999 },
  },
  maintenance: {
    0: { starter: 0,     growth: 0,      enterprise: 0 },
    1: { starter: 14999, growth: 29999,  enterprise: 49999 },
    2: { starter: 24999, growth: 49999,  enterprise: 89999 },
    5: { starter: 49999, growth: 99999,  enterprise: 199999 },
  }
};

// Load cached pricing from Admin Console / Supabase Cloud / Google Sheet
// Load cached pricing from Admin Console / Supabase Cloud / Google Sheet
function loadCachedPricing() {
  if (typeof localStorage !== 'undefined') {
    try {
      const cachedPricing = localStorage.getItem('savrajas_pricing');
      if (cachedPricing) {
        const parsed = JSON.parse(cachedPricing);
        if (parsed.projects && Object.keys(parsed.projects).length > 0) PRICING.projects = parsed.projects;
        if (parsed.addons && Object.keys(parsed.addons).length > 0) PRICING.addons = parsed.addons;
        if (parsed.maintenance && Object.keys(parsed.maintenance).length > 0) PRICING.maintenance = parsed.maintenance;
      }
    } catch (e) {
      console.warn('[Quotation] Could not load cached pricing:', e);
    }
  }

  // Asynchronously sync from Supabase Cloud if configured
  if (typeof window !== 'undefined') {
    import('./supabase.js').then(({ fetchPricingFromCloud }) => {
      fetchPricingFromCloud().then(cloudPricing => {
        if (cloudPricing) {
          if (cloudPricing.projects && Object.keys(cloudPricing.projects).length > 0) PRICING.projects = cloudPricing.projects;
          if (cloudPricing.addons && Object.keys(cloudPricing.addons).length > 0) PRICING.addons = cloudPricing.addons;
          if (cloudPricing.maintenance && Object.keys(cloudPricing.maintenance).length > 0) PRICING.maintenance = cloudPricing.maintenance;
          localStorage.setItem('savrajas_pricing', JSON.stringify(cloudPricing));
          renderStep1Cards();
          renderStep2Cards();
          if (typeof currentStep !== 'undefined') {
            if (currentStep === 2) {
              updateStep2LiveBar();
              updateSelectionSummary();
            } else if (currentStep >= 3) {
              renderStep3();
              updateSelectionSummary();
            }
          }
        }
      }).catch(() => {});
    }).catch(() => {});
  }
}
loadCachedPricing();

// Background real-time polling to sync pricing across devices/tabs from Supabase
let isCheckingCloudPricing = false;
async function checkCloudPricing() {
  if (isCheckingCloudPricing || typeof window === 'undefined') return;
  try {
    const { fetchPricingFromCloud, isSupabaseConfigured } = await import('./supabase.js');
    if (!isSupabaseConfigured()) return;
    isCheckingCloudPricing = true;
    const cloudPricing = await fetchPricingFromCloud();
    if (cloudPricing && cloudPricing.projects && Object.keys(cloudPricing.projects).length > 0) {
      const currentSnap = JSON.stringify(PRICING);
      const cloudSnap = JSON.stringify(cloudPricing);
      if (currentSnap !== cloudSnap) {
        PRICING.projects = cloudPricing.projects;
        if (cloudPricing.addons) PRICING.addons = cloudPricing.addons;
        if (cloudPricing.maintenance) PRICING.maintenance = cloudPricing.maintenance;
        localStorage.setItem('savrajas_pricing', JSON.stringify(cloudPricing));

        // Validate selected project in case deleted
        if (selectedProject && !PRICING.projects[selectedProject]) {
          selectedProject = Object.keys(PRICING.projects)[0] || null;
        }
        // Validate selected addons
        selectedAddons.forEach(a => {
          if (!PRICING.addons[a]) selectedAddons.delete(a);
        });

        renderStep1Cards();
        renderStep2Cards();
        if (currentStep === 2) {
          updateStep2LiveBar();
          updateSelectionSummary();
        } else if (currentStep >= 3) {
          renderStep3();
          updateSelectionSummary();
        }
      }
    }
  } catch (err) {
  } finally {
    isCheckingCloudPricing = false;
  }
}

// Check every 15s, and whenever visitor switches back to the tab
if (typeof window !== 'undefined') {
  setInterval(checkCloudPricing, 15000);
  window.addEventListener('focus', checkCloudPricing);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkCloudPricing();
  });
}

// Real-time synchronization when modified in Savrajas Admin App
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'savrajas_pricing') {
      loadCachedPricing();
      if (selectedProject && !PRICING.projects[selectedProject]) {
        selectedProject = Object.keys(PRICING.projects)[0] || null;
      }
      selectedAddons.forEach(a => {
        if (!PRICING.addons[a]) selectedAddons.delete(a);
      });
      renderStep1Cards();
      renderStep2Cards();
      if (typeof currentStep !== 'undefined') {
        if (currentStep === 2) {
          updateStep2LiveBar();
          updateSelectionSummary();
        } else if (currentStep >= 3) {
          renderStep3();
          updateSelectionSummary();
        }
      }
    }
  });
}

// ---------------------------------------------------------------------------
// TRANSLATIONS (EN · HI · MR)
// ---------------------------------------------------------------------------
const T = {
  en: {
    quote_tag: 'Instant Quote',
    quote_title: 'Get Your Price Estimate',
    quote_subtitle: 'Select what you need and see your estimated cost instantly — no hidden charges, no complicated terms.',
    step1_label: 'Choose Project',
    step2_label: 'Add Features',
    step3_label: 'See Pricing',
    step1_title: 'What do you want to build?',
    step1_desc: 'Pick the type of project that best fits your needs',
    step2_title: 'Want to add extra features?',
    step2_desc: 'Select any additional features you\'d like (optional — you can skip)',
    step3_title: 'Choose Your Plan',
    step3_desc: 'Pick a plan and maintenance duration that fits your budget',
    proj_showcase: 'Showcase Website',
    proj_showcase_desc: 'A beautiful website to show your work or brand',
    proj_business: 'Business Website',
    proj_business_desc: 'Professional site for your company or services',
    proj_portfolio: 'Portfolio Website',
    proj_portfolio_desc: 'Display your creative work and skills',
    proj_ecommerce: 'Online Store',
    proj_ecommerce_desc: 'Sell products online with shopping cart & payments',
    proj_blog: 'Blog / News Site',
    proj_blog_desc: 'Share stories, articles and updates with readers',
    proj_landing: 'Single Page',
    proj_landing_desc: 'One stunning page for your campaign or product',
    addon_android: 'Mobile App (Android)',
    addon_android_desc: 'Your project as an Android app on phones',
    addon_backend: 'Connect with Other Apps',
    addon_backend_desc: 'Link your site with tools & services',
    addon_admin: 'Admin Panel',
    addon_admin_desc: 'Control panel to manage your website easily',
    addon_payments: 'Accept Online Payments',
    addon_payments_desc: 'Let customers pay directly on your site',
    addon_chat: 'Live Chat Support',
    addon_chat_desc: 'Chat widget so visitors can message you instantly',
    maint_label: 'Maintenance & Support',
    maint_0: 'No Maintenance',
    maint_0_desc: 'One-time delivery only',
    maint_1: '1 Year',
    maint_1_desc: 'Updates & fixes for 1 year',
    maint_2: '2 Years',
    maint_2_desc: 'Stay worry-free for longer',
    maint_5: '5 Years',
    maint_5_desc: 'Best value, complete peace of mind',
    tier_starter: 'Starter',
    tier_starter_tag: 'Budget Friendly',
    tier_growth: 'Growth',
    tier_growth_tag: 'Most Popular',
    tier_enterprise: 'Enterprise',
    tier_enterprise_tag: 'Full Service',
    feat_starter: [
      'Free website address',
      'Website stays online 24/7',
      '500 MB storage space',
      'Security lock on your website',
      'Basic design template',
      'Email support',
    ],
    feat_growth: [
      'Your own website address',
      'Website stays online 24/7',
      '2 GB storage space',
      'Security lock on your website',
      'Custom professional design',
      'Phone & email support',
      'Speed optimization',
    ],
    feat_enterprise: [
      'Your own website address',
      'Website stays online 24/7',
      'Unlimited storage space',
      'Security lock on your website',
      'Premium custom design',
      '24/7 phone, email & WhatsApp',
      'Speed optimization',
      'Google/Play Store publishing',
      'Marketing & SEO help',
      'Monthly performance reports',
    ],
    btn_continue: 'Continue to Pricing',
    btn_skip: 'Skip, no extras needed',
    btn_get_quote: 'Get My Quote',
    btn_back: 'Back',
    btn_change: 'Change',
    total_label: 'Estimated Total',
    starting_at: 'Starting at',
    per_project: 'for complete project',
    selected: 'Selected',
    form_name: 'Your Name',
    form_email: 'Email Address',
    form_phone: 'Phone Number (WhatsApp)',
    form_submit: 'Send My Quote Request',
    form_success: 'Your quote has been sent! We\'ll contact you within 24 hours.',
    nav_pricing: 'Pricing',
    includes_addons: 'Includes selected add-ons & maintenance',
    no_addons: 'Base project price',
    your_selection: 'Your Selection',
  },
  hi: {
    quote_tag: 'तुरंत कीमत जानें',
    quote_title: 'अपनी कीमत का अनुमान पाएं',
    quote_subtitle: 'आपको क्या चाहिए वो चुनें और तुरंत अनुमानित लागत देखें — कोई छुपी हुई फीस नहीं, कोई मुश्किल शब्द नहीं।',
    step1_label: 'प्रोजेक्ट चुनें',
    step2_label: 'फीचर जोड़ें',
    step3_label: 'कीमत देखें',
    step1_title: 'आप क्या बनवाना चाहते हैं?',
    step1_desc: 'अपनी ज़रूरत के हिसाब से प्रोजेक्ट का प्रकार चुनें',
    step2_title: 'क्या आप अतिरिक्त फीचर चाहते हैं?',
    step2_desc: 'कोई भी अतिरिक्त फीचर चुनें (वैकल्पिक — आप छोड़ भी सकते हैं)',
    step3_title: 'अपना प्लान चुनें',
    step3_desc: 'अपने बजट के अनुसार प्लान और रखरखाव अवधि चुनें',
    proj_showcase: 'शोकेस वेबसाइट',
    proj_showcase_desc: 'अपना काम या ब्रांड दिखाने के लिए सुंदर वेबसाइट',
    proj_business: 'बिज़नेस वेबसाइट',
    proj_business_desc: 'आपकी कंपनी या सेवाओं के लिए प्रोफेशनल वेबसाइट',
    proj_portfolio: 'पोर्टफोलियो वेबसाइट',
    proj_portfolio_desc: 'अपना रचनात्मक काम और कौशल्य दिखाएं',
    proj_ecommerce: 'ऑनलाइन दुकान',
    proj_ecommerce_desc: 'शॉपिंग कार्ट के साथ ऑनलाइन प्रोडक्ट बेचें',
    proj_blog: 'ब्लॉग / समाचार साइट',
    proj_blog_desc: 'कहानियां, लेख और अपडेट साझा करें',
    proj_landing: 'सिंगल पेज',
    proj_landing_desc: 'आपके कैम्पेन या प्रोडक्ट के लिए एक सुंदर पेज',
    addon_android: 'मोबाइल ऐप (Android)',
    addon_android_desc: 'आपका प्रोजेक्ट Android फोन पर ऐप के रूप में',
    addon_backend: 'अन्य ऐप्स से जोड़ें',
    addon_backend_desc: 'अपनी साइट को अन्य टूल्स और सेवाओं से जोड़ें',
    addon_admin: 'एडमिन पैनल',
    addon_admin_desc: 'वेबसाइट को आसानी से मैनेज करने का कंट्रोल पैनल',
    addon_payments: 'ऑनलाइन भुगतान स्वीकारें',
    addon_payments_desc: 'ग्राहक सीधे आपकी साइट पर पेमेंट करें',
    addon_chat: 'लाइव चैट सपोर्ट',
    addon_chat_desc: 'विज़िटर तुरंत आपको मैसेज कर सकें',
    maint_label: 'रखरखाव और सहायता',
    maint_0: 'कोई रखरखाव नहीं',
    maint_0_desc: 'केवल एक बार डिलीवरी',
    maint_1: '1 साल',
    maint_1_desc: '1 साल के लिए अपडेट और सुधार',
    maint_2: '2 साल',
    maint_2_desc: 'लंबे समय तक निश्चिंत रहें',
    maint_5: '5 साल',
    maint_5_desc: 'सबसे अच्छा मूल्य, पूर्ण मन की शांति',
    tier_starter: 'स्टार्टर',
    tier_starter_tag: 'बजट फ्रेंडली',
    tier_growth: 'ग्रोथ',
    tier_growth_tag: 'सबसे लोकप्रिय',
    tier_enterprise: 'एंटरप्राइज',
    tier_enterprise_tag: 'पूर्ण सेवा',
    feat_starter: [
      'मुफ्त वेबसाइट पता',
      'वेबसाइट 24/7 ऑनलाइन रहेगी',
      '500 MB स्टोरेज स्पेस',
      'वेबसाइट पर सुरक्षा लॉक',
      'बेसिक डिज़ाइन टेम्पलेट',
      'ईमेल सपोर्ट',
    ],
    feat_growth: [
      'आपका अपना वेबसाइट पता',
      'वेबसाइट 24/7 ऑनलाइन रहेगी',
      '2 GB स्टोरेज स्पेस',
      'वेबसाइट पर सुरक्षा लॉक',
      'कस्टम प्रोफेशनल डिज़ाइन',
      'फोन और ईमेल सपोर्ट',
      'स्पीड ऑप्टिमाइज़ेशन',
    ],
    feat_enterprise: [
      'आपका अपना वेबसाइट पता',
      'वेबसाइट 24/7 ऑनलाइन रहेगी',
      'अनलिमिटेड स्टोरेज स्पेस',
      'वेबसाइट पर सुरक्षा लॉक',
      'प्रीमियम कस्टम डिज़ाइन',
      '24/7 फोन, ईमेल और WhatsApp सपोर्ट',
      'स्पीड ऑप्टिमाइज़ेशन',
      'Google/Play Store पर प्रकाशन',
      'मार्केटिंग और SEO सहायता',
      'मासिक प्रदर्शन रिपोर्ट',
    ],
    btn_continue: 'कीमत देखने के लिए आगे बढ़ें',
    btn_skip: 'छोड़ें, एक्स्ट्रा नहीं चाहिए',
    btn_get_quote: 'मेरा कोट पाएं',
    btn_back: 'वापस जाएं',
    btn_change: 'बदलें',
    total_label: 'अनुमानित कुल',
    starting_at: 'शुरुआती कीमत',
    per_project: 'पूरे प्रोजेक्ट के लिए',
    selected: 'चुना गया',
    form_name: 'आपका नाम',
    form_email: 'ईमेल पता',
    form_phone: 'फोन नंबर (WhatsApp)',
    form_submit: 'मेरा कोट अनुरोध भेजें',
    form_success: 'आपका कोट भेज दिया गया! हम 24 घंटे में आपसे संपर्क करेंगे।',
    nav_pricing: 'कीमत',
    includes_addons: 'चुने गए ऐड-ऑन और रखरखाव शामिल',
    no_addons: 'बेस प्रोजेक्ट की कीमत',
    your_selection: 'आपकी पसंद',
  },
  mr: {
    quote_tag: 'तात्काळ किंमत जाणा',
    quote_title: 'तुमच्या किंमतीचा अंदाज घ्या',
    quote_subtitle: 'तुम्हाला काय हवे ते निवडा आणि लगेच अंदाजित खर्च पहा — कोणतेही लपलेले शुल्क नाही, कठीण शब्द नाहीत।',
    step1_label: 'प्रोजेक्ट निवडा',
    step2_label: 'फीचर जोडा',
    step3_label: 'किंमत पहा',
    step1_title: 'तुम्हाला काय बनवायचे आहे?',
    step1_desc: 'तुमच्या गरजेनुसार प्रोजेक्टचा प्रकार निवडा',
    step2_title: 'अतिरिक्त फीचर्स हवे आहेत का?',
    step2_desc: 'तुम्हाला हवे असलेले कोणतेही अतिरिक्त फीचर निवडा (ऐच्छिक — वगळू शकता)',
    step3_title: 'तुमचा प्लान निवडा',
    step3_desc: 'तुमच्या बजेटनुसार प्लान आणि देखभाल कालावधी निवडा',
    proj_showcase: 'शोकेस वेबसाइट',
    proj_showcase_desc: 'तुमचे काम किंवा ब्रँड दाखवण्यासाठी सुंदर वेबसाइट',
    proj_business: 'बिझनेस वेबसाइट',
    proj_business_desc: 'तुमच्या कंपनी किंवा सेवांसाठी प्रोफेशनल वेबसाइट',
    proj_portfolio: 'पोर्टफोलिओ वेबसाइट',
    proj_portfolio_desc: 'तुमचे सर्जनशील काम आणि कौशल्य दाखवा',
    proj_ecommerce: 'ऑनलाइन दुकान',
    proj_ecommerce_desc: 'शॉपिंग कार्टसह ऑनलाइन प्रोडक्ट विका',
    proj_blog: 'ब्लॉग / बातम्या साइट',
    proj_blog_desc: 'कथा, लेख आणि अपडेट्स शेअर करा',
    proj_landing: 'सिंगल पेज',
    proj_landing_desc: 'तुमच्या कॅम्पेन किंवा प्रोडक्टसाठी एक सुंदर पेज',
    addon_android: 'मोबाइल ॲप (Android)',
    addon_android_desc: 'तुमचा प्रोजेक्ट Android फोनवर ॲप म्हणून',
    addon_backend: 'इतर ॲप्सशी जोडा',
    addon_backend_desc: 'तुमची साइट इतर टूल्स आणि सेवांशी जोडा',
    addon_admin: 'ॲडमिन पॅनेल',
    addon_admin_desc: 'वेबसाइट सहज व्यवस्थापित करण्यासाठी कंट्रोल पॅनेल',
    addon_payments: 'ऑनलाइन पेमेंट स्वीकारा',
    addon_payments_desc: 'ग्राहक थेट तुमच्या साइटवर पेमेंट करतील',
    addon_chat: 'लाइव्ह चॅट सपोर्ट',
    addon_chat_desc: 'विझिटर लगेच तुम्हाला मेसेज करू शकतील',
    maint_label: 'देखभाल आणि सहाय्य',
    maint_0: 'देखभाल नाही',
    maint_0_desc: 'फक्त एकदाच डिलिव्हरी',
    maint_1: '१ वर्ष',
    maint_1_desc: '१ वर्षासाठी अपडेट्स आणि दुरुस्ती',
    maint_2: '२ वर्षे',
    maint_2_desc: 'जास्त काळ निश्चिंत रहा',
    maint_5: '५ वर्षे',
    maint_5_desc: 'सर्वोत्तम मूल्य, पूर्ण मनःशांती',
    tier_starter: 'स्टार्टर',
    tier_starter_tag: 'बजेट फ्रेंडली',
    tier_growth: 'ग्रोथ',
    tier_growth_tag: 'सर्वात लोकप्रिय',
    tier_enterprise: 'एंटरप्राइज',
    tier_enterprise_tag: 'पूर्ण सेवा',
    feat_starter: [
      'मोफत वेबसाइट पत्ता',
      'वेबसाइट 24/7 ऑनलाइन राहील',
      '500 MB स्टोरेज स्पेस',
      'वेबसाइटवर सुरक्षा लॉक',
      'बेसिक डिझाइन टेम्पलेट',
      'ईमेल सपोर्ट',
    ],
    feat_growth: [
      'तुमचा स्वतःचा वेबसाइट पत्ता',
      'वेबसाइट 24/7 ऑनलाइन राहील',
      '2 GB स्टोरेज स्पेस',
      'वेबसाइटवर सुरक्षा लॉक',
      'कस्टम प्रोफेशनल डिझाइन',
      'फोन आणि ईमेल सपोर्ट',
      'स्पीड ऑप्टिमायझेशन',
    ],
    feat_enterprise: [
      'तुमचा स्वतःचा वेबसाइट पत्ता',
      'वेबसाइट 24/7 ऑनलाइन राहील',
      'अनलिमिटेड स्टोरेज स्पेस',
      'वेबसाइटवर सुरक्षा लॉक',
      'प्रीमियम कस्टम डिझाइन',
      '24/7 फोन, ईमेल आणि WhatsApp सपोर्ट',
      'स्पीड ऑप्टिमायझेशन',
      'Google/Play Store वर प्रकाशन',
      'मार्केटिंग आणि SEO सहाय्य',
      'मासिक कामगिरी अहवाल',
    ],
    btn_continue: 'किंमत पाहण्यासाठी पुढे जा',
    btn_skip: 'वगळा, एक्स्ट्रा नको',
    btn_get_quote: 'माझे कोट मिळवा',
    btn_back: 'मागे जा',
    btn_change: 'बदला',
    total_label: 'अंदाजित एकूण',
    starting_at: 'सुरुवातीची किंमत',
    per_project: 'संपूर्ण प्रोजेक्टसाठी',
    selected: 'निवडले',
    form_name: 'तुमचे नाव',
    form_email: 'ईमेल पत्ता',
    form_phone: 'फोन नंबर (WhatsApp)',
    form_submit: 'माझा कोट विनंती पाठवा',
    form_success: 'तुमचा कोट पाठवला! आम्ही 24 तासांत तुमच्याशी संपर्क करू.',
    nav_pricing: 'किंमत',
    includes_addons: 'निवडलेले ॲड-ऑन आणि देखभाल समाविष्ट',
    no_addons: 'बेस प्रोजेक्ट किंमत',
    your_selection: 'तुमची निवड',
  }
};

// ---------------------------------------------------------------------------
// SVG ICONS for project types and add-ons
// ---------------------------------------------------------------------------
const ICONS = {
  showcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  business: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  portfolio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
  ecommerce: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  blog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  landing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  android: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  backend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  admin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  payments: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
};

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------
let currentLang = 'en';
let currentStep = 1;
let selectedProject = null;
let selectedAddons = new Set();
let selectedMaintenance = 0;

// ---------------------------------------------------------------------------
// UTILITY: Format price in INR
// ---------------------------------------------------------------------------
function formatINR(num) {
  return '₹' + num.toLocaleString('en-IN');
}

// ---------------------------------------------------------------------------
// UTILITY: Get translation
// ---------------------------------------------------------------------------
function t(key) {
  return T[currentLang]?.[key] || T.en[key] || key;
}

// ---------------------------------------------------------------------------
// CALCULATE TOTAL PRICE for a given tier
// ---------------------------------------------------------------------------
function calcTotal(tier) {
  if (!selectedProject) return 0;
  let total = Number(PRICING.projects[selectedProject]?.[tier]) || 0;
  selectedAddons.forEach(addon => {
    total += Number(PRICING.addons[addon]?.[tier]) || 0;
  });
  total += Number(PRICING.maintenance[selectedMaintenance]?.[tier]) || 0;
  return total;
}

// ---------------------------------------------------------------------------
// RENDER: Update all text to current language
// ---------------------------------------------------------------------------
function updateLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });

  // Update language buttons active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
  });

  // Re-render dynamic content
  renderStep1Cards();
  renderStep2Cards();
  if (currentStep >= 3) renderStep3();
}

// ---------------------------------------------------------------------------
// RENDER: Step 1 - Project Type Cards (Dynamic from PRICING.projects)
// ---------------------------------------------------------------------------
function renderStep1Cards() {
  const grid = document.getElementById('projectTypeGrid');
  if (!grid) return;

  const projects = Object.keys(PRICING.projects);
  grid.innerHTML = projects.map(p => {
    const projData = PRICING.projects[p];
    const starterPrice = Number(projData?.starter) || 0;
    const priceBadge = starterPrice ? `<span class="qt-card-price-badge">${t('starting_at')} ${formatINR(starterPrice)}</span>` : '';
    const label = projData?.label || (t('proj_' + p) !== 'proj_' + p ? t('proj_' + p) : p);
    const desc = projData?.desc || (t('proj_' + p + '_desc') !== 'proj_' + p + '_desc' ? t('proj_' + p + '_desc') : 'Custom engineering deployment');
    const icon = ICONS[p] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`;

    return `
    <button class="qt-project-card ${selectedProject === p ? 'selected' : ''}" data-project="${p}" aria-label="${label}">
      <div class="qt-project-icon">${icon}</div>
      <div class="qt-project-info">
        <h4>${label}</h4>
        <p>${desc}</p>
        ${priceBadge}
      </div>
      <div class="qt-check-badge">${ICONS.check}</div>
    </button>
  `;
  }).join('');

  // Attach listeners
  grid.querySelectorAll('.qt-project-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedProject = card.getAttribute('data-project');
      renderStep1Cards();
      // Auto advance to step 2 with smooth animation
      setTimeout(() => goToStep(2), 350);
    });
  });
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// RENDER: Step 2 - Add-on Cards (Dynamic from PRICING.addons)
// ---------------------------------------------------------------------------
function renderStep2Cards() {
  const grid = document.getElementById('addonsGrid');
  if (!grid) return;

  const addons = Object.keys(PRICING.addons);
  grid.innerHTML = addons.map(a => {
    const addonData = PRICING.addons[a];
    const addonPrice = Number(addonData?.starter) || 0;
    const priceBadge = addonPrice ? `<span class="qt-card-price-badge">+${formatINR(addonPrice)}</span>` : '';
    const label = addonData?.label || (t('addon_' + a) !== 'addon_' + a ? t('addon_' + a) : a);
    const desc = addonData?.desc || (t('addon_' + a + '_desc') !== 'addon_' + a + '_desc' ? t('addon_' + a + '_desc') : 'Custom add-on functionality');
    const icon = ICONS[a] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="9"/></svg>`;

    return `
    <button class="qt-addon-card ${selectedAddons.has(a) ? 'selected' : ''}" data-addon="${a}" aria-label="${label}">
      <div class="qt-addon-icon">${icon}</div>
      <div class="qt-addon-info">
        <h4>${label}</h4>
        <p>${desc}</p>
        ${priceBadge}
      </div>
      <div class="qt-toggle-switch">
        <div class="qt-toggle-track"><div class="qt-toggle-thumb"></div></div>
      </div>
    </button>
  `;
  }).join('');

  // Attach listeners with real-time price auto-addition
  grid.querySelectorAll('.qt-addon-card').forEach(card => {
    card.addEventListener('click', () => {
      const addon = card.getAttribute('data-addon');
      if (selectedAddons.has(addon)) {
        selectedAddons.delete(addon);
      } else {
        selectedAddons.add(addon);
      }
      renderStep2Cards();
      updateStep2LiveBar();
      updateSelectionSummary();
    });
  });

  updateStep2LiveBar();
}

// Live real-time price auto-addition bar for Step 2
function updateStep2LiveBar() {
  const bar = document.getElementById('step2LiveTotalBar');
  if (!bar) return;
  if (!selectedProject || currentStep !== 2) {
    bar.style.display = 'none';
    return;
  }

  bar.style.display = 'flex';
  const projData = PRICING.projects[selectedProject];
  const basePrice = Number(projData?.starter) || 0;
  const projLabel = projData?.label || (t('proj_' + selectedProject) !== 'proj_' + selectedProject ? t('proj_' + selectedProject) : selectedProject);

  let addonsSum = 0;
  selectedAddons.forEach(a => {
    addonsSum += (Number(PRICING.addons[a]?.starter) || 0);
  });
  const runningTotal = basePrice + addonsSum;

  const breakdownEl = document.getElementById('step2LiveBreakdown');
  const amountEl = document.getElementById('step2LiveTotalAmount');

  if (breakdownEl) {
    if (selectedAddons.size === 0) {
      breakdownEl.textContent = `${projLabel} (${formatINR(basePrice)}) · Click any add-on above to auto-add`;
    } else {
      breakdownEl.textContent = `${projLabel} (${formatINR(basePrice)}) + ${selectedAddons.size} Add-on${selectedAddons.size > 1 ? 's' : ''} (+${formatINR(addonsSum)})`;
    }
  }

  if (amountEl) {
    amountEl.textContent = formatINR(runningTotal);
    amountEl.classList.remove('pulse-highlight');
    void amountEl.offsetWidth; // trigger reflow
    amountEl.classList.add('pulse-highlight');
  }
}

// ---------------------------------------------------------------------------
// RENDER: Step 3 - Maintenance + Pricing Tiers
// ---------------------------------------------------------------------------
function renderStep3() {
  renderMaintenanceSelector();
  renderPricingTiers();
}

function renderMaintenanceSelector() {
  const container = document.getElementById('maintenanceSelector');
  if (!container) return;

  const options = [0, 1, 2, 5];
  container.innerHTML = `
    <h4 class="qt-maint-label" data-i18n="maint_label">${t('maint_label')}</h4>
    <div class="qt-maint-options">
      ${options.map(m => {
        const maintPrice = Number(PRICING.maintenance[m]?.starter) || 0;
        const priceLabel = m === 0 ? t('selected') : `+${formatINR(maintPrice)}`;
        return `
        <button class="qt-maint-btn ${selectedMaintenance === m ? 'active' : ''}" data-maint="${m}">
          <span class="qt-maint-name">${t('maint_' + m)}</span>
          <span class="qt-maint-desc">${t('maint_' + m + '_desc')}</span>
          <span class="qt-maint-price-badge">${priceLabel}</span>
        </button>
      `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('.qt-maint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMaintenance = parseInt(btn.getAttribute('data-maint'), 10);
      renderStep3();
      updateSelectionSummary();
    });
  });
}

function renderPricingTiers() {
  const container = document.getElementById('pricingTiersGrid');
  if (!container) return;

  const tiers = ['starter', 'growth', 'enterprise'];

  container.innerHTML = tiers.map(tier => {
    const basePrice = selectedProject ? (Number(PRICING.projects[selectedProject]?.[tier]) || 0) : 0;
    let addonsPrice = 0;
    selectedAddons.forEach(a => {
      addonsPrice += (Number(PRICING.addons[a]?.[tier]) || 0);
    });
    const maintPrice = Number(PRICING.maintenance[selectedMaintenance]?.[tier]) || 0;
    const total = basePrice + addonsPrice + maintPrice;

    const features = t('feat_' + tier) || [];
    const isPopular = tier === 'growth';

    return `
      <div class="qt-tier-card ${isPopular ? 'popular' : ''}" data-tier="${tier}">
        ${isPopular ? `<div class="qt-popular-badge">${t('tier_' + tier + '_tag')}</div>` : ''}
        <div class="qt-tier-header">
          <span class="qt-tier-tag">${t('tier_' + tier + '_tag')}</span>
          <h3 class="qt-tier-name">${t('tier_' + tier)}</h3>
        </div>
        <div class="qt-tier-price">
          <span class="qt-price-amount">${formatINR(total)}</span>
          <span class="qt-price-sub">${selectedAddons.size > 0 || selectedMaintenance > 0 ? t('includes_addons') : t('no_addons')}</span>
        </div>

        <!-- Real-Time Auto-Addition Math Breakdown -->
        <div class="qt-tier-breakdown-row">
          <div class="qt-breakdown-item">
            <span class="qt-breakdown-lbl">Base Project:</span>
            <span class="qt-breakdown-val">${formatINR(basePrice)}</span>
          </div>
          ${selectedAddons.size > 0 ? `
          <div class="qt-breakdown-item">
            <span class="qt-breakdown-lbl">+ ${selectedAddons.size} Add-on${selectedAddons.size > 1 ? 's' : ''}:</span>
            <span class="qt-breakdown-val">+${formatINR(addonsPrice)}</span>
          </div>` : ''}
          ${maintPrice > 0 ? `
          <div class="qt-breakdown-item">
            <span class="qt-breakdown-lbl">+ ${selectedMaintenance} Yr SLA:</span>
            <span class="qt-breakdown-val">+${formatINR(maintPrice)}</span>
          </div>` : ''}
        </div>

        <ul class="qt-tier-features">
          ${features.map(f => `<li>${ICONS.check}<span>${f}</span></li>`).join('')}
        </ul>
        <button class="qt-tier-select-btn" data-tier="${tier}">
          ${t('btn_get_quote')}
        </button>
      </div>
    `;
  }).join('');

  // Attach tier selection
  container.querySelectorAll('.qt-tier-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.getAttribute('data-tier');
      showQuoteForm(tier);
    });
  });
}

// ---------------------------------------------------------------------------
// STEP NAVIGATION
// ---------------------------------------------------------------------------
function goToStep(step) {
  const prevStep = currentStep;
  currentStep = step;

  // Update step indicators
  document.querySelectorAll('.qt-step-indicator').forEach(ind => {
    const s = parseInt(ind.getAttribute('data-step'), 10);
    ind.classList.toggle('active', s === currentStep);
    ind.classList.toggle('completed', s < currentStep);
  });

  document.querySelectorAll('.qt-step-connector').forEach((conn, i) => {
    conn.classList.toggle('active', i + 1 < currentStep);
  });

  // Show/hide steps with animation
  const steps = document.querySelectorAll('.qt-step-panel');
  steps.forEach(panel => {
    const panelStep = parseInt(panel.getAttribute('data-step'), 10);
    if (panelStep === currentStep) {
      panel.classList.remove('hidden');
      panel.classList.add('animate-in');
      // Scroll to the step
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      panel.classList.add('hidden');
      panel.classList.remove('animate-in');
    }
  });

  // If going to step 2, update live bar
  if (step === 2) {
    updateStep2LiveBar();
  }

  // If going to step 3, render pricing
  if (step === 3) {
    renderStep3();
  }

  // Update selection summary
  updateSelectionSummary();
}

// Expose navigation globally for clickable interactive chips
if (typeof window !== 'undefined') {
  window.qtGoToStep = goToStep;
}

// ---------------------------------------------------------------------------
// SELECTION SUMMARY (shown in steps 2 & 3 with Auto Addition Total)
// ---------------------------------------------------------------------------
function updateSelectionSummary() {
  const summary = document.getElementById('selectionSummary');
  if (!summary) return;

  if (currentStep < 2 || !selectedProject) {
    summary.style.display = 'none';
    return;
  }

  summary.style.display = 'flex';
  const projData = PRICING.projects[selectedProject];
  const projectName = projData?.label || (t('proj_' + selectedProject) !== 'proj_' + selectedProject ? t('proj_' + selectedProject) : selectedProject);
  const projectBase = Number(projData?.starter) || 0;

  let addonsPrice = 0;
  const addonChips = Array.from(selectedAddons).map(a => {
    const aData = PRICING.addons[a];
    const aTitle = aData?.label || (t('addon_' + a) !== 'addon_' + a ? t('addon_' + a) : a);
    const aPrice = Number(aData?.starter) || 0;
    addonsPrice += aPrice;
    return `<button type="button" class="qt-chip qt-chip-addon" onclick="window.qtGoToStep(2)" title="Click to edit add-ons">${aTitle} (+${formatINR(aPrice)}) ✏️</button>`;
  });

  const maintPrice = Number(PRICING.maintenance[selectedMaintenance]?.starter) || 0;
  const runningTotal = projectBase + addonsPrice + maintPrice;

  summary.innerHTML = `
    <div class="qt-summary-content">
      <span class="qt-summary-label">${t('your_selection')}:</span>
      <div class="qt-summary-chips">
        <button type="button" class="qt-chip qt-chip-project" onclick="window.qtGoToStep(1)" title="Click to Change Project Type">
          📂 ${projectName} (${formatINR(projectBase)}) ✏️
        </button>
        ${addonChips.join('')}
        ${selectedMaintenance > 0 ? `<button type="button" class="qt-chip qt-chip-maint" onclick="window.qtGoToStep(3)" title="Click to change maintenance">🛡️ ${selectedMaintenance} Yr SLA (+${formatINR(maintPrice)}) ✏️</button>` : ''}
        ${currentStep === 3 ? `<button type="button" class="qt-chip qt-chip-add-more" onclick="window.qtGoToStep(2)" title="Add or remove extra features">🧩 + Extra Features</button>` : ''}
      </div>
    </div>
    <div class="qt-summary-total-badge">
      <span>Auto Addition Total:</span>
      <strong id="summaryRunningTotal">${formatINR(runningTotal)}</strong>
    </div>
  `;

  const badgeTotal = document.getElementById('summaryRunningTotal');
  if (badgeTotal) {
    badgeTotal.classList.remove('pulse-highlight');
    void badgeTotal.offsetWidth;
    badgeTotal.classList.add('pulse-highlight');
  }
}

// ---------------------------------------------------------------------------
// QUOTE FORM MODAL WITH ITEMIZED BREAKDOWN
// ---------------------------------------------------------------------------
function showQuoteForm(tier) {
  const modal = document.getElementById('quoteFormModal');
  if (!modal) return;

  const basePrice = selectedProject ? (Number(PRICING.projects[selectedProject]?.[tier]) || 0) : 0;
  let addonsSum = 0;
  const addonList = [];
  selectedAddons.forEach(a => {
    const aData = PRICING.addons[a];
    const aPrice = Number(aData?.[tier]) || 0;
    addonsSum += aPrice;
    addonList.push({
      label: aData?.label || (t('addon_' + a) !== 'addon_' + a ? t('addon_' + a) : a),
      price: aPrice
    });
  });
  const maintPrice = Number(PRICING.maintenance[selectedMaintenance]?.[tier]) || 0;
  const total = basePrice + addonsSum + maintPrice;

  const projTitle = PRICING.projects[selectedProject]?.label || (t('proj_' + selectedProject) !== 'proj_' + selectedProject ? t('proj_' + selectedProject) : selectedProject);

  document.getElementById('quoteFormTierName').textContent = t('tier_' + tier) + ' Plan';
  document.getElementById('quoteFormTotal').textContent = formatINR(total);
  document.getElementById('quoteFormTierInput').value = tier;

  // Render Itemized Math Breakdown
  const breakdownEl = document.getElementById('quoteFormBreakdown');
  if (breakdownEl) {
    breakdownEl.innerHTML = `
      <div class="qt-modal-itemized">
        <div class="qt-modal-line">
          <span>${projTitle} (${t('tier_' + tier)} Plan)</span>
          <strong>${formatINR(basePrice)}</strong>
        </div>
        ${addonList.map(a => `
          <div class="qt-modal-line sub">
            <span>+ ${a.label}</span>
            <span>+${formatINR(a.price)}</span>
          </div>
        `).join('')}
        ${maintPrice > 0 ? `
          <div class="qt-modal-line sub">
            <span>+ ${selectedMaintenance} Year(s) Maintenance SLA</span>
            <span>+${formatINR(maintPrice)}</span>
          </div>
        ` : ''}
        <div class="qt-modal-line total">
          <span>Calculated Total Auto Addition</span>
          <span>${formatINR(total)}</span>
        </div>
      </div>
    `;
  }

  // Update labels
  document.getElementById('quoteFormNameLabel').textContent = t('form_name');
  document.getElementById('quoteFormEmailLabel').textContent = t('form_email');
  document.getElementById('quoteFormPhoneLabel').textContent = t('form_phone');
  document.getElementById('quoteFormSubmitBtn').textContent = t('form_submit');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuoteForm() {
  const modal = document.getElementById('quoteFormModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ---------------------------------------------------------------------------
// GOOGLE SHEETS LIVE SYNC & PARSER
// ---------------------------------------------------------------------------
const KNOWN_PROJECTS = ['showcase', 'business', 'portfolio', 'ecommerce', 'blog', 'landing'];
const KNOWN_ADDONS = ['android', 'backend', 'admin', 'payments', 'chat'];
const KNOWN_MAINTENANCE = ['0', '1', '2', '5'];

function parsePrice(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).trim();
  if (/^[₹$€£\s]*\d+[\d,\.\s]*$/.test(str)) {
    const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function parseSheetRows(rows) {
  const updatedPricing = { projects: {}, addons: {}, maintenance: {} };
  let validCount = 0;
  if (!rows || rows.length === 0) return { updatedPricing, validCount };

  // Detect header row if present
  let headerIdx = -1;
  let idCol = 1;
  let starterCol = 3;
  let growthCol = 4;
  let enterpriseCol = 5;

  for (let r = 0; r < Math.min(3, rows.length); r++) {
    const cells = (rows[r]?.c || []).map(cell => String(cell?.v || '').toLowerCase().trim());
    const sCol = cells.findIndex(c => c.includes('starter') || c.includes('basic'));
    const gCol = cells.findIndex(c => c.includes('growth') || c.includes('pro'));
    const eCol = cells.findIndex(c => c.includes('enterprise') || c.includes('premium'));
    const iCol = cells.findIndex(c => c === 'id' || c.includes('code') || c.includes('key'));

    if (sCol !== -1 && gCol !== -1) {
      headerIdx = r;
      starterCol = sCol;
      growthCol = gCol;
      enterpriseCol = eCol !== -1 ? eCol : gCol + 1;
      if (iCol !== -1) idCol = iCol;
      break;
    }
  }

  const startRow = headerIdx !== -1 ? headerIdx + 1 : 0;

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row.c) continue;
    const cells = row.c;

    let idVal = String(cells[idCol]?.v || '').trim().toLowerCase();

    // If ID not at expected col, scan row for any known ID
    if (!KNOWN_PROJECTS.includes(idVal) && !KNOWN_ADDONS.includes(idVal) && !KNOWN_MAINTENANCE.includes(idVal)) {
      for (let c = 0; c < cells.length; c++) {
        const candidate = String(cells[c]?.v || '').trim().toLowerCase();
        if (KNOWN_PROJECTS.includes(candidate) || KNOWN_ADDONS.includes(candidate) || KNOWN_MAINTENANCE.includes(candidate)) {
          idVal = candidate;
          break;
        }
      }
    }

    if (!idVal) continue;

    const starter = parsePrice(cells[starterCol]?.v);
    const growth = parsePrice(cells[growthCol]?.v);
    const enterprise = parsePrice(cells[enterpriseCol]?.v);

    if (starter > 0 || growth > 0 || enterprise > 0 || idVal === '0') {
      if (KNOWN_PROJECTS.includes(idVal)) {
        updatedPricing.projects[idVal] = { starter, growth, enterprise };
        validCount++;
      } else if (KNOWN_ADDONS.includes(idVal)) {
        updatedPricing.addons[idVal] = { starter, growth, enterprise };
        validCount++;
      } else if (KNOWN_MAINTENANCE.includes(idVal)) {
        updatedPricing.maintenance[parseInt(idVal, 10)] = { starter, growth, enterprise };
        validCount++;
      }
    }
  }

  return { updatedPricing, validCount };
}

function fetchSheetViaJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'gvizCallback_' + Math.round(1000000 * Math.random());
    const script = document.createElement('script');
    const fullUrl = url + (url.includes('?') ? '&' : '?') + 'tqx=responseHandler:' + callbackName + '&_t=' + Date.now();

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Google Sheet request timeout'));
    }, 8000);

    function cleanup() {
      clearTimeout(timeout);
      if (script.parentNode) script.parentNode.removeChild(script);
      delete window[callbackName];
    }

    window[callbackName] = function(response) {
      cleanup();
      if (response && response.status === 'ok' && response.table) {
        resolve(response.table);
      } else {
        reject(new Error(response?.errors?.[0]?.message || 'Invalid sheet response'));
      }
    };

    script.onerror = function() {
      cleanup();
      reject(new Error('Network error loading Google Sheet'));
    };

    script.src = fullUrl;
    document.head.appendChild(script);
  });
}

let isSyncing = false;
let lastSyncTime = 0;

export async function fetchPricingFromGoogleSheet(isManual = false) {
  if (isSyncing) return;
  const now = Date.now();
  if (!isManual && now - lastSyncTime < 4000) return; // Debounce 4s

  isSyncing = true;
  lastSyncTime = now;

  try {
    let table = null;

    // First attempt: Tab named "Pricing"
    try {
      table = await fetchSheetViaJsonp(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=Pricing`);
    } catch (e) {
      table = null;
    }

    // Fallback: first tab (gid=0)
    if (!table || !table.rows || table.rows.length === 0) {
      table = await fetchSheetViaJsonp(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?gid=0`);
    }

    if (table && table.rows && table.rows.length > 0) {
      const { updatedPricing, validCount } = parseSheetRows(table.rows);

      if (validCount > 0) {
        // Only merge if local storage doesn't already hold active custom pricing or Supabase configuration
        const hasCustomPricing = Boolean(localStorage.getItem('savrajas_pricing'));
        if (!hasCustomPricing) {
          if (Object.keys(updatedPricing.projects).length) Object.assign(PRICING.projects, updatedPricing.projects);
          if (Object.keys(updatedPricing.addons).length) Object.assign(PRICING.addons, updatedPricing.addons);
          if (Object.keys(updatedPricing.maintenance).length) Object.assign(PRICING.maintenance, updatedPricing.maintenance);

          localStorage.setItem('savrajas_pricing', JSON.stringify(PRICING));

          // Re-render UI with updated pricing in background
          renderStep1Cards();
          renderStep2Cards();
          if (currentStep >= 3) renderStep3();

          console.log(`[Quotation Backend] Successfully synced ${validCount} live prices from Google Sheet.`);
        }
      }
    }
  } catch (err) {
    console.debug('[Quotation Backend] Sheet background sync notice:', err.message);
  } finally {
    isSyncing = false;
  }
}

function setupSheetSync() {
  // Silent background sync immediately on load
  fetchPricingFromGoogleSheet();

  // Auto-sync whenever user focuses back on the tab (e.g. sheet updated)
  window.addEventListener('focus', () => {
    fetchPricingFromGoogleSheet();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      fetchPricingFromGoogleSheet();
    }
  });

  // Background polling every 45 seconds to keep prices fresh silently
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetchPricingFromGoogleSheet();
    }
  }, 45000);
}

// ---------------------------------------------------------------------------
// GOOGLE SHEETS SUBMISSION
// ---------------------------------------------------------------------------
async function submitToSheets(data) {
  // Save locally in all cases so leads are never lost
  try {
    const leads = JSON.parse(localStorage.getItem('savrajas_quote_leads') || '[]');
    leads.push(data);
    localStorage.setItem('savrajas_quote_leads', JSON.stringify(leads));
  } catch (e) {}

  // Sync to Supabase Cloud CRM in background
  try {
    const { pushLeadToCloud } = await import('./supabase.js');
    await pushLeadToCloud(data);
  } catch (err) {
    console.warn('[Quotation] Supabase pushLeadToCloud:', err);
  }

  if (SHEETS_URL && SHEETS_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
    try {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      return true;
    } catch (err) {
      console.error('[Quotation] Sheets submission error:', err);
    }
  } else {
    console.log('[Quotation] Lead recorded locally & cloud-queued:', data);
  }

  return true;
}

// ---------------------------------------------------------------------------
// INIT: Wire up the entire quotation system
// ---------------------------------------------------------------------------
export function initQuotation() {
  // Language Buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.getAttribute('data-lang');
      updateLanguage();
    });
  });

  // Interactive Step Indicators (Direct Step Navigation)
  document.querySelectorAll('.qt-step-indicator').forEach(ind => {
    ind.style.cursor = 'pointer';
    ind.addEventListener('click', () => {
      const targetStep = parseInt(ind.getAttribute('data-step'), 10);
      if (targetStep === 1) {
        goToStep(1);
      } else if (targetStep === 2 && selectedProject) {
        goToStep(2);
      } else if (targetStep === 3 && selectedProject) {
        goToStep(3);
      }
    });
  });

  // Initialize cards
  renderStep1Cards();
  renderStep2Cards();

  // Step 2 Continue Button
  const continueBtn = document.getElementById('step2ContinueBtn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => goToStep(3));
  }

  // Step 2 Skip Button
  const skipBtn = document.getElementById('step2SkipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      selectedAddons.clear();
      renderStep2Cards();
      goToStep(3);
    });
  }

  // Back Buttons
  document.querySelectorAll('.qt-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.getAttribute('data-target'));
      goToStep(targetStep);
    });
  });

  // Quote Form Close
  const formCloseBtn = document.getElementById('quoteFormCloseBtn');
  if (formCloseBtn) {
    formCloseBtn.addEventListener('click', closeQuoteForm);
  }

  const formModal = document.getElementById('quoteFormModal');
  if (formModal) {
    formModal.addEventListener('click', (e) => {
      if (e.target === formModal) closeQuoteForm();
    });
  }

  // Quote Form Submit
  const quoteForm = document.getElementById('quoteSubmitForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const tier = document.getElementById('quoteFormTierInput').value;
      const total = calcTotal(tier);

      const rawName = (document.getElementById('quoteFormName').value || '').trim().slice(0, 100);
      const rawEmail = (document.getElementById('quoteFormEmail').value || '').trim().slice(0, 200);
      const rawPhone = (document.getElementById('quoteFormPhone').value || '').trim().slice(0, 20);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!rawEmail || !emailRegex.test(rawEmail)) {
        alert('Please provide a valid email address.');
        return;
      }

      // Reject HTML tags in name
      if (/<[^>]*>/g.test(rawName)) {
        alert('Please enter a valid name.');
        return;
      }

      const data = {
        timestamp: new Date().toISOString(),
        language: currentLang,
        name: rawName,
        email: rawEmail,
        phone: rawPhone,
        projectType: PRICING.projects[selectedProject]?.label || selectedProject,
        addons: Array.from(selectedAddons).map(a => PRICING.addons[a]?.label || a).join(', '),
        maintenance: selectedMaintenance + ' years',
        tier: tier,
        totalPrice: total,
        currency: 'INR',
      };

      const submitBtn = document.getElementById('quoteFormSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = '...';

      const success = await submitToSheets(data);

      if (success) {
        closeQuoteForm();

        // Show toast
        const toast = document.getElementById('toastMsg');
        const toastText = document.getElementById('toastText');
        if (toast && toastText) {
          toastText.textContent = t('form_success');
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 5000);
        }

        // Reset
        quoteForm.reset();
      }

      submitBtn.disabled = false;
      submitBtn.textContent = t('form_submit');
    });
  }

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuoteForm();
  });

  // Start Google Sheets Live Sync
  setupSheetSync();
}
