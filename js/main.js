import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initQuotation } from './quotation.js';
import { pushLeadToCloud } from './supabase.js';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initLenisSmoothScroll();
  initGsapScrollAnimations();
  initHeroVideo();
  initNavbar();
  initHeroSlider();
  syncCustomPortfolio();
  initHorizontalPortfolio();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initQuotation();
});

/* ==========================================================================
   LENIS SMOOTH SCROLL ENGINE (Savrajas High-Performance Experience Engine)
   ========================================================================== */
function initLenisSmoothScroll() {
  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    smoothTouch: false,
    touchMultiplier: 1.8,
    infinite: false,
  });

  window.lenisInstance = lenisInstance;

  // Synchronize Lenis with GSAP ScrollTrigger exclusively (eliminates double-RAF desync)
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    // Critical: Disable GSAP lagSmoothing so ticker times remain linear and jitter-free
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth anchor scrolling via Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, { offset: -70, duration: 1.1 });
        }
      }
    });
  });
}

/* ==========================================================================
   GSAP SCROLLTRIGGER ANIMATIONS (Savrajas Design System)
   ========================================================================== */
function initGsapScrollAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Reveal
  gsap.from('#heroTitle', {
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power3.out'
  });
  gsap.from('#heroDesc', {
    opacity: 0,
    y: 30,
    duration: 1.0,
    delay: 0.3,
    ease: 'power2.out'
  });
  gsap.from('.hero-actions', {
    opacity: 0,
    y: 25,
    duration: 0.8,
    delay: 0.5,
    ease: 'power2.out'
  });

  if (typeof ScrollTrigger === 'undefined') return;

  // Services Stagger Reveal
  gsap.from('.service-item', {
    scrollTrigger: {
      trigger: '.services-card-container',
      start: 'top 80%',
      once: true
    },
    opacity: 0,
    y: 45,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Vision & Mission 3D Entrance (Savrajas Glassmorphic 3D Cards)
  gsap.from('.vision-card', {
    scrollTrigger: {
      trigger: '#vision',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    x: -60,
    rotation: -2,
    scale: 0.95,
    duration: 1.0,
    ease: 'power3.out'
  });

  gsap.from('.mv-card', {
    scrollTrigger: {
      trigger: '#vision',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    x: 60,
    rotation: 2,
    scale: 0.95,
    stagger: 0.2,
    duration: 1.0,
    ease: 'power3.out'
  });


  // Metrics Counter Animation
  ScrollTrigger.create({
    trigger: '#metrics',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from('.metric-item', {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.2)'
      });
    }
  });
}

/* ==========================================================================
   0. HERO VIDEO SMOOTH PLAYBACK & DUAL-VIDEO ENGINE
   ========================================================================== */
function initHeroVideo() {
  const vid1 = document.getElementById('heroVideo1');
  const vid2 = document.getElementById('heroVideo2');
  if (!vid1 && !vid2) return;

  if (vid1) {
    vid1.playbackRate = 1.0;
    const playPromise = vid1.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        vid1.muted = true;
        vid1.play().catch(() => {});
      });
    }
  }

  // Pre-configure video 2 (hero2.mp4) for immediate start on slide 2
  if (vid2) {
    vid2.playbackRate = 1.0;
    vid2.muted = true;
    const playPromise2 = vid2.play();
    if (playPromise2 !== undefined) {
      playPromise2.catch(() => {});
    }
  }

  // Performance Optimization: Pause video when hero is scrolled out of viewport
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeVid = document.querySelector('.hero-video-bg.active');
          if (activeVid && activeVid.paused) {
            activeVid.play().catch(() => {});
          }
        } else {
          if (vid1 && !vid1.paused) vid1.pause();
          if (vid2 && !vid2.paused) vid2.pause();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && heroSection && heroSection.getBoundingClientRect().bottom > 0) {
      const activeVid = document.querySelector('.hero-video-bg.active');
      if (activeVid && activeVid.paused) {
        activeVid.play().catch(() => {});
      }
    }
  });
}

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer .nav-link');
  const btt = document.getElementById('backToTop');

  // Unified high-performance scroll handling throttled with rAF / Lenis
  let scrollTicking = false;
  function updateScrollElements(scrollY) {
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    if (btt) {
      if (scrollY > 500) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }
  }

  if (lenisInstance) {
    lenisInstance.on('scroll', (e) => {
      updateScrollElements(e.scroll);
    });
  } else {
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateScrollElements(window.scrollY);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section tracking with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ==========================================================================
   2. HERO SLIDER & VIDEO CROSSFADE (hero.mp4 & hero2.mp4)
   ========================================================================== */
const heroSlides = [
  {
    title: 'CREATING EXPERIENCES<br><span class="gradient-text">THAT INSPIRE</span>',
    desc: "Design isn't just what we do—it's how we think. At Savrajas, we're obsessed with crafting beautiful, intuitive experiences that connect with users emotionally and drive meaningful engagement.",
    video: 1
  },
  {
    title: 'BUILDING THE<br><span class="gradient-text">FUTURE TOGETHER</span>',
    desc: "We believe in collaboration, creativity, and pushing boundaries. Our team is driven by the desire to solve complex challenges and deliver solutions that exceed expectations every single time.",
    video: 2
  },
  {
    title: 'INNOVATING THROUGH<br><span class="gradient-text">EMPOWERING DIGITAL</span>',
    desc: "We're passionate about turning visionary concepts into powerful digital experiences. Every project is an opportunity to create something extraordinary that makes a real impact on people's lives.",
    video: 1
  }
];

function initHeroSlider() {
  const titleEl = document.getElementById('heroTitle');
  const descEl = document.getElementById('heroDesc');
  const dots = document.querySelectorAll('.hero-dot');
  const dotsContainer = document.querySelector('.hero-slider-dots');
  const vid1 = document.getElementById('heroVideo1');
  const vid2 = document.getElementById('heroVideo2');
  const heroSection = document.getElementById('hero');

  if (!titleEl || !descEl || dots.length === 0) return;

  let currentIdx = 0;
  let timer = null;
  let isTransitioning = false;

  function switchHeroVideo(videoNum) {
    if (videoNum === 2) {
      if (vid2) {
        vid2.classList.add('active');
        if (vid2.paused) vid2.play().catch(() => {});
      }
      if (vid1) {
        vid1.classList.remove('active');
      }
    } else {
      if (vid1) {
        vid1.classList.add('active');
        if (vid1.paused) vid1.play().catch(() => {});
      }
      if (vid2) {
        vid2.classList.remove('active');
      }
    }
  }

  function setSlide(index) {
    if (index === currentIdx && isTransitioning) return;
    currentIdx = ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;
    isTransitioning = true;

    // 1. Instantly update active dot pill
    dots.forEach((dot, i) => {
      const isActive = i === currentIdx;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    // 2. Crossfade background video
    const targetVideo = heroSlides[currentIdx]?.video || 1;
    switchHeroVideo(targetVideo);

    // 3. Smooth animated text switch with GSAP
    if (typeof gsap !== 'undefined') {
      gsap.to([titleEl, descEl], {
        opacity: 0,
        y: -12,
        duration: 0.22,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: () => {
          titleEl.innerHTML = heroSlides[currentIdx].title;
          descEl.textContent = heroSlides[currentIdx].desc;

          gsap.fromTo([titleEl, descEl],
            { opacity: 0, y: 14 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.35, 
              ease: 'power2.out', 
              stagger: 0.05,
              onComplete: () => {
                isTransitioning = false;
              }
            }
          );
        }
      });
    } else {
      titleEl.innerHTML = heroSlides[currentIdx].title;
      descEl.textContent = heroSlides[currentIdx].desc;
      isTransitioning = false;
    }
  }

  function nextSlide() {
    setSlide(currentIdx + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, 7000);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Dot button click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      setSlide(idx);
      startAutoplay();
    });
  });

  // Delegated click on dots container in case user clicks near a dot
  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.hero-dot');
      if (dot) {
        e.preventDefault();
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        setSlide(idx);
        startAutoplay();
      }
    });
  }

  // Pause on hover over hero section, resume on leave
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  // Start autoplay immediately
  startAutoplay();
}

/* ==========================================================================
   3. PORTFOLIO DATA & DYNAMIC SYNC ENGINE
   ========================================================================== */
const projectDetails = {
  'ml-sentiment-analyzer': {
    title: 'ML Sentiment Analyzer',
    category: 'Machine Learning & NLP',
    logo: '',
    client: 'Savrajas Internal R&D',
    industry: 'AI & Natural Language Processing',
    timeline: '3 Months',
    techStack: 'Python, BERT, Flask, React, AWS SageMaker',
    desc: 'A real-time sentiment analysis engine that processes social media feeds, customer reviews, and support tickets using fine-tuned BERT transformers. Delivers actionable brand sentiment dashboards with 94% accuracy and sub-second inference latency.'
  },
  'image-classifier': {
    title: 'Image Classification Engine',
    category: 'Deep Learning & Computer Vision',
    logo: '',
    client: 'Enterprise Vision Labs',
    industry: 'AI & Computer Vision',
    timeline: '4 Months',
    techStack: 'Python, TensorFlow, Keras, OpenCV, GCP Vertex AI',
    desc: 'A production-grade image classification system trained on 50K+ labeled images using custom CNN architectures. Supports multi-class object recognition, defect detection in manufacturing, and automated visual quality assurance pipelines.'
  },
  'predictive-analytics': {
    title: 'Predictive Analytics Dashboard',
    category: 'Data Science & Business Intelligence',
    logo: '',
    client: 'DataDriven Corp',
    industry: 'Data Science & Business Analytics',
    timeline: '3.5 Months',
    techStack: 'Python, Scikit-learn, Pandas, Plotly Dash, PostgreSQL',
    desc: 'An end-to-end ML pipeline that ingests enterprise data, trains gradient-boosted models for revenue forecasting, churn prediction, and demand planning. Interactive dashboards visualize predictions with confidence intervals and feature importance rankings.'
  },
  'recommendation-engine': {
    title: 'AI Recommendation Engine',
    category: 'Machine Learning & Personalization',
    logo: '',
    client: 'ShopSmart E-Commerce',
    industry: 'E-Commerce & Personalization',
    timeline: '4 Months',
    techStack: 'Python, Surprise, FastAPI, Redis, React, Docker',
    desc: 'A hybrid recommendation system combining collaborative filtering and content-based approaches. Serves personalized product suggestions to 100K+ users in real time via a REST API, increasing average order value by 28% in A/B testing.'
  },
  'nlp-chatbot': {
    title: 'NLP Smart Chatbot',
    category: 'Conversational AI & LLM',
    logo: '',
    client: 'CustomerFirst Solutions',
    industry: 'Conversational AI & Customer Support',
    timeline: '5 Months',
    techStack: 'Python, LangChain, OpenAI GPT, Pinecone, Next.js',
    desc: 'An intelligent conversational assistant powered by retrieval-augmented generation (RAG). Understands context across multi-turn dialogues, integrates with knowledge bases, and handles 80% of tier-1 support queries autonomously with 92% satisfaction.'
  },
  'fraud-detection': {
    title: 'Fraud Detection System',
    category: 'ML & Cybersecurity',
    logo: '',
    client: 'SecurePay Financial',
    industry: 'FinTech & Cybersecurity',
    timeline: '4.5 Months',
    techStack: 'Python, XGBoost, Isolation Forest, Kafka, Spark, AWS',
    desc: 'A real-time fraud detection pipeline processing 10K+ transactions per minute. Uses ensemble anomaly detection models trained on 2M+ historical records to flag suspicious activity with 97.5% precision and under 50ms latency.'
  },
  'autovista-car': {
    title: 'AutoVista — Car Showroom',
    category: 'Automotive & E-Commerce',
    logo: '',
    client: 'AutoVista Motors',
    industry: 'Automotive & Luxury Vehicles',
    timeline: '4 Months',
    techStack: 'Next.js, Three.js, WebGL, Strapi CMS, Stripe Payments',
    desc: 'A premium car showroom website featuring interactive 3D vehicle configurators, 360° interior tours, real-time pricing calculators, EMI estimators, and test drive booking. Designed to replicate the in-person dealership experience digitally.'
  },
  'propnest-property': {
    title: 'PropNest — Property Platform',
    category: 'Real Estate & Listings',
    logo: '',
    client: 'PropNest Realty',
    industry: 'Real Estate & Property Management',
    timeline: '5 Months',
    techStack: 'React, Node.js, MongoDB, Google Maps API, Cloudinary',
    desc: 'A full-stack property listing platform with advanced search filters, interactive map-based browsing, virtual property tours, mortgage calculators, and agent-client messaging. Supports both residential and commercial listings across multiple cities.'
  },
  'dineflow-restaurant': {
    title: 'DineFlow — Restaurant Platform',
    category: 'Food & Hospitality Digitalization',
    logo: '',
    client: 'DineFlow Hospitality Group',
    industry: 'Restaurant & Food Service Technology',
    timeline: '3.5 Months',
    techStack: 'React Native, Node.js, Firebase, Razorpay, QR APIs',
    desc: 'A complete restaurant digitalization suite with QR-code menu ordering, real-time kitchen display systems, table management, POS integration, loyalty programs, and delivery tracking. Reduced order-to-serve time by 40% for pilot restaurants.'
  },
  'fitpulse-fitness': {
    title: 'FitPulse — Fitness Tracker',
    category: 'Health & Wellness App',
    logo: '',
    client: 'FitPulse Health Tech',
    industry: 'Health, Fitness & Wearable Technology',
    timeline: '4 Months',
    techStack: 'React Native, HealthKit, Google Fit API, TensorFlow Lite',
    desc: 'A cross-platform fitness tracking app with AI-powered workout recommendations, calorie tracking, sleep analysis, and wearable device integration. ML models personalize exercise plans based on user behavior patterns and health goals.'
  },
  'edusphere-elearning': {
    title: 'EduSphere — E-Learning',
    category: 'EdTech & Learning Management',
    logo: '',
    client: 'EduSphere Academy',
    industry: 'Education Technology & Online Learning',
    timeline: '5 Months',
    techStack: 'Next.js, Django, PostgreSQL, AWS MediaConvert, Stripe',
    desc: 'A feature-rich LMS platform with live video classes, adaptive quizzes, progress analytics, certificate generation, and multi-tenant support for institutions. Handles 5K+ concurrent learners with sub-second page loads.'
  },
  'agrisense-agriculture': {
    title: 'AgriSense — Smart Agriculture',
    category: 'AgriTech & IoT',
    logo: '',
    client: 'AgriSense Technologies',
    industry: 'Agriculture & IoT Automation',
    timeline: '6 Months',
    techStack: 'Python, MQTT, InfluxDB, React, TensorFlow, Raspberry Pi',
    desc: 'An IoT-driven smart farming platform that collects soil moisture, temperature, and weather data from field sensors. ML models predict optimal irrigation schedules and crop disease risks, reducing water usage by 35% for partner farms.'
  },
  'fleetsync-logistics': {
    title: 'FleetSync — Logistics Dashboard',
    category: 'Supply Chain & Fleet Management',
    logo: '',
    client: 'FleetSync Logistics',
    industry: 'Supply Chain & Transportation',
    timeline: '4 Months',
    techStack: 'React, Node.js, Socket.io, Mapbox, MongoDB, Docker',
    desc: 'A real-time fleet management dashboard with GPS tracking, route optimization, delivery ETAs, driver analytics, and warehouse inventory sync. Reduced delivery delays by 22% through ML-powered route suggestions.'
  },
  'mediconnect-healthcare': {
    title: 'MediConnect — Telemedicine',
    category: 'Healthcare & Digital Health',
    logo: '',
    client: 'MediConnect Health Systems',
    industry: 'Healthcare & Telemedicine',
    timeline: '5 Months',
    techStack: 'React, Node.js, WebRTC, HIPAA-Compliant AWS, Twilio',
    desc: 'A HIPAA-compliant telemedicine platform with HD video consultations, e-prescriptions, lab report management, appointment scheduling, and integrated payment processing. Serves 2K+ patient consultations per month.'
  },
  'paynova-fintech': {
    title: 'PayNova — FinTech Wallet',
    category: 'Finance & Digital Payments',
    logo: '',
    client: 'PayNova Financial Services',
    industry: 'FinTech & Digital Banking',
    timeline: '6 Months',
    techStack: 'React Native, Node.js, Ethereum/Solidity, UPI SDK, AWS',
    desc: 'A next-gen digital wallet app supporting UPI payments, peer-to-peer transfers, bill splitting, blockchain-backed transaction records, and micro-investment features. PCI-DSS Level 1 certified with biometric authentication.'
  }
};


function syncCustomPortfolio() {
  const track = document.querySelector('.portfolio-track');
  if (!track) return;

  const raw = localStorage.getItem('savrajas_custom_portfolio');
  if (!raw) return;

  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) return;

    // 1. Update projectDetails dictionary
    list.forEach(item => {
      projectDetails[item.id] = {
        title: item.title,
        category: item.category,
        logo: item.logo || 'assets/images/savrajas-logo-raw.png',
        client: item.client || item.title,
        industry: item.industry || item.category,
        timeline: item.timeline || '3 Months',
        techStack: item.techStack || 'Web, Cloud, AI',
        desc: item.desc || '',
        liveLink: item.liveLink || ''
      };
    });

    // 2. Index existing cards in DOM
    const existingCards = {};
    track.querySelectorAll('.project-card').forEach(card => {
      const id = card.getAttribute('data-project');
      if (id) existingCards[id] = card;
    });

    const activeIds = new Set(list.map(i => i.id));

    // Remove deleted cards
    Object.keys(existingCards).forEach(id => {
      if (!activeIds.has(id)) {
        existingCards[id].remove();
        delete existingCards[id];
      }
    });

    // Update existing or append new cards
    list.forEach(item => {
      const card = existingCards[item.id];
      const tagsList = (item.tags || item.category || 'Web')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      const tagsHtml = tagsList.map(t => `<span class="card-tag">${t}</span>`).join('\n                ');

      if (card) {
        const logoImg = card.querySelector('.card-client-logo');
        if (logoImg) {
          logoImg.src = item.logo || 'assets/images/savrajas-logo-raw.png';
          logoImg.alt = item.title;
        }
        const titleEl = card.querySelector('.card-project-title');
        if (titleEl) titleEl.textContent = item.title;

        const catEl = card.querySelector('.card-project-cat');
        if (catEl) catEl.textContent = item.category;

        const tagsContainer = card.querySelector('.card-tags');
        if (tagsContainer) tagsContainer.innerHTML = tagsHtml;
      } else {
        const newCard = document.createElement('article');
        newCard.className = 'project-card';
        newCard.setAttribute('data-project', item.id);
        newCard.innerHTML = `
            <div class="card-media-bg">
              <div class="card-logo-box">
                <img src="${item.logo || 'assets/images/savrajas-logo-raw.png'}" alt="${item.title}" class="card-client-logo" loading="lazy" decoding="async" width="160" height="50">
              </div>
            </div>
            <div class="card-content-box">
              <h3 class="card-project-title">${item.title}</h3>
              <p class="card-project-cat">${item.category}</p>
              <div class="card-tags">
                ${tagsHtml}
              </div>
              <button class="card-action-btn" aria-label="View ${item.title} details">
                <span>View Case Study</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
        `;
        track.appendChild(newCard);
      }
    });

    window.dispatchEvent(new Event('resize'));
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  } catch (err) {
    console.warn('Could not sync custom portfolio:', err);
  }
}

// Sync whenever updated from Admin tab
window.addEventListener('storage', (e) => {
  if (e.key === 'savrajas_custom_portfolio') {
    syncCustomPortfolio();
  }
});

// Also sync latest portfolio from Supabase Cloud if configured
if (typeof window !== 'undefined') {
  import('./supabase.js').then(({ fetchPortfolioFromCloud }) => {
    fetchPortfolioFromCloud().then(cloudProjects => {
      if (cloudProjects && Array.isArray(cloudProjects) && cloudProjects.length > 0) {
        localStorage.setItem('savrajas_custom_portfolio', JSON.stringify(cloudProjects));
        syncCustomPortfolio();
      }
    }).catch(() => {});
  }).catch(() => {});
}

/* ==========================================================================
   4. HORIZONTAL SHOWCASE FOR PORTFOLIO (Fluid Carousel & Slidable Scrollbar)
   ========================================================================== */
function initHorizontalPortfolio() {
  const portfolioSection = document.getElementById('portfolio');
  const scrollContainer = document.getElementById('portfolioScrollContainer');
  const track = scrollContainer ? scrollContainer.querySelector('.portfolio-track') : null;
  const prevBtn = document.getElementById('portfolioPrevBtn');
  const nextBtn = document.getElementById('portfolioNextBtn');
  const progressFill = document.getElementById('portfolioProgressFill');
  const progressTrack = document.getElementById('portfolioProgressTrack');
  const counterEl = document.getElementById('portfolioCounter');

  if (!portfolioSection || !scrollContainer || !track) return;

  function getMaxScroll() {
    return Math.max(0, scrollContainer.scrollWidth - scrollContainer.clientWidth);
  }

  function getCardStep() {
    const card = track.querySelector('.project-card');
    if (!card) return 360;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return card.offsetWidth + gap;
  }

  function getTotalCards() {
    return track.querySelectorAll('.project-card').length || 15;
  }

  // Helper to update progress bar, buttons, and counter
  function updateUI() {
    const maxScroll = getMaxScroll();
    const currentScroll = scrollContainer.scrollLeft;
    const progress = maxScroll > 0 ? Math.max(0, Math.min(1, currentScroll / maxScroll)) : 0;

    // Progress bar fill width (minimum 8% for the thumb)
    if (progressFill) {
      const pct = 8 + progress * 92;
      progressFill.style.width = `${pct}%`;
    }

    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', Math.round(progress * 100));
    }

    if (prevBtn) {
      prevBtn.disabled = progress <= 0.01;
    }

    if (nextBtn) {
      nextBtn.disabled = progress >= 0.99;
    }

    // Dynamic 01 / 12 counter based on active card
    if (counterEl) {
      const total = getTotalCards();
      const cardStep = getCardStep();
      const activeIdx = Math.min(total, Math.max(1, Math.round(currentScroll / cardStep) + 1));
      counterEl.textContent = `${String(activeIdx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
  }

  // Update UI on scroll (passive for 60fps performance)
  scrollContainer.addEventListener('scroll', updateUI, { passive: true });

  // Navigation Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollContainer.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollContainer.scrollBy({ left: getCardStep(), behavior: 'smooth' });
    });
  }

  // Interactive Draggable Scrollbar Thumb & Track Click
  if (progressTrack) {
    let isBarDragging = false;

    function handleBarMove(clientX, isSmooth = false) {
      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return;
      const rect = progressTrack.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetScroll = ratio * maxScroll;

      if (isSmooth) {
        scrollContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
      } else {
        scrollContainer.scrollLeft = targetScroll;
      }
    }

    // Click on track to jump
    progressTrack.addEventListener('click', (e) => {
      if (!isBarDragging) {
        handleBarMove(e.clientX, true);
      }
    });

    // Mouse drag on scrollbar
    progressTrack.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      isBarDragging = true;
      progressTrack.classList.add('dragging');
      scrollContainer.classList.add('dragging');
      handleBarMove(e.clientX, false);

      const onMouseMove = (ev) => {
        if (!isBarDragging) return;
        ev.preventDefault();
        handleBarMove(ev.clientX, false);
      };

      const onMouseUp = () => {
        if (isBarDragging) {
          isBarDragging = false;
          progressTrack.classList.remove('dragging');
          scrollContainer.classList.remove('dragging');
        }
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // Touch drag on scrollbar (supports mobile sliding)
    progressTrack.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches[0]) return;
      isBarDragging = true;
      progressTrack.classList.add('dragging');
      scrollContainer.classList.add('dragging');
      handleBarMove(e.touches[0].clientX, false);
    }, { passive: true });

    progressTrack.addEventListener('touchmove', (e) => {
      if (!isBarDragging || !e.touches || !e.touches[0]) return;
      e.preventDefault(); // Prevent page vertical scroll while dragging the thumb
      handleBarMove(e.touches[0].clientX, false);
    }, { passive: false });

    progressTrack.addEventListener('touchend', () => {
      if (isBarDragging) {
        isBarDragging = false;
        progressTrack.classList.remove('dragging');
        scrollContainer.classList.remove('dragging');
      }
    });
  }

  // Desktop Mouse Drag on Cards
  let isContainerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;

  scrollContainer.addEventListener('mousedown', (e) => {
    // Only left click and ignore clicks on buttons or links
    if (e.button !== 0 || e.target.closest('.card-action-btn') || e.target.closest('a')) return;
    isContainerDown = true;
    hasDragged = false;
    startX = e.pageX - scrollContainer.offsetLeft;
    startScrollLeft = scrollContainer.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isContainerDown) {
      isContainerDown = false;
      scrollContainer.classList.remove('dragging');
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isContainerDown) return;
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(x - startX) > 6) {
      hasDragged = true;
      scrollContainer.classList.add('dragging');
      e.preventDefault();
      scrollContainer.scrollLeft = startScrollLeft - walk;
    }
  });

  // Trackpad horizontal wheel support
  scrollContainer.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaX;
    }
  }, { passive: false });

  // Expose hasMoved check for card click handling
  scrollContainer._hasMoved = () => hasDragged;

  // Window resize refresh
  window.addEventListener('resize', updateUI);

  // Initial update
  updateUI();
}

/* ==========================================================================
   5. PROJECT CASE STUDY MODAL
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const titleEl = document.getElementById('modalTitle');
  const catEl = document.getElementById('modalCategory');
  const descEl = document.getElementById('modalDesc');
  const clientEl = document.getElementById('modalClient');
  const industryEl = document.getElementById('modalIndustry');
  const timelineEl = document.getElementById('modalTimeline');
  const techEl = document.getElementById('modalTech');
  const logoEl = document.getElementById('modalLogo');
  const liveLinkBtn = document.getElementById('modalLiveLinkBtn');
  const discussBtn = document.getElementById('modalDiscussBtn');

  if (!modal) return;

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.category;
    if (descEl) descEl.textContent = data.desc;
    if (clientEl) clientEl.textContent = data.client;
    if (industryEl) industryEl.textContent = data.industry;
    if (timelineEl) timelineEl.textContent = data.timeline;
    if (techEl) techEl.textContent = data.techStack;
    // Dynamic banner and logo/icon presentation
    const headerBanner = document.getElementById('modalHeaderBanner');
    const iconWrap = document.getElementById('modalIconWrap');
    const card = document.querySelector(`.project-card[data-project="${projectId}"]`);

    if (data.logo && data.logo.trim()) {
      if (logoEl) {
        logoEl.src = data.logo;
        logoEl.alt = data.title;
        logoEl.style.display = 'block';
      }
      if (iconWrap) iconWrap.style.display = 'none';
      if (headerBanner) headerBanner.style.background = '';
    } else {
      if (logoEl) {
        logoEl.src = '';
        logoEl.style.display = 'none';
      }
      if (card) {
        const mediaBg = card.querySelector('.card-media-bg');
        const iconSvg = card.querySelector('.card-icon-svg');
        if (mediaBg && headerBanner) {
          headerBanner.style.background = mediaBg.style.background || '';
        }
        if (iconSvg && iconWrap) {
          iconWrap.innerHTML = iconSvg.outerHTML;
          iconWrap.style.display = 'flex';
        } else if (iconWrap) {
          iconWrap.style.display = 'none';
        }
      }
    }

    if (liveLinkBtn) {
      if (data.liveLink && data.liveLink.trim()) {
        liveLinkBtn.href = data.liveLink.trim();
        liveLinkBtn.style.display = 'inline-flex';
      } else {
        liveLinkBtn.style.display = 'none';
      }
    }

    // Lock background scroll cleanly without breaking modal scrolling
    document.body.classList.add('modal-open');

    // Pause Lenis smooth scrolling while modal is open
    if (window.lenisInstance) window.lenisInstance.stop();

    modal.classList.add('open');

    // Scroll modal body to top
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');

    // Resume Lenis
    if (window.lenisInstance) window.lenisInstance.start();
  }

  // Delegated click handling for both static and dynamically added/updated cards
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-action-btn');
    const card = e.target.closest('.project-card');
    const targetCard = card || (btn ? btn.closest('.project-card') : null);
    if (!targetCard) return;

    // Don't trigger if user was dragging
    const container = document.getElementById('portfolioScrollContainer');
    if (container) {
      if (container.classList.contains('dragging')) return;
      if (container._hasMoved && container._hasMoved()) return;
    }

    const projectId = targetCard.getAttribute('data-project');
    if (projectId) {
      openModal(projectId);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (discussBtn) {
    discussBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. CONTACT FORM & INTERACTIVE CRM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');

  if (!form) return;

  const serviceLabels = {
    ai: 'AI Solutions & Automation',
    cloud: 'Cloud Architecture & DevOps',
    app: 'App Development (iOS & Android)',
    web: 'Web Solutions & Applications',
    seo: 'SEO & Search Performance',
    marketing: 'Marketing Strategy & Growth',
    design: 'UI/UX Design & Prototyping'
  };

  const budgetValues = {
    '25k-50k': { min: 25000, max: 50000, label: '₹25,000 – ₹50,000' },
    '50k-100k': { min: 50000, max: 100000, label: '₹50,000 – ₹1,00,000' },
    '100k-250k': { min: 100000, max: 250000, label: '₹1,00,000 – ₹2,50,000' },
    '250k-500k': { min: 250000, max: 500000, label: '₹2,50,000 – ₹5,00,000' },
    '500k+': { min: 500000, max: 1000000, label: '₹5,00,000+' }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const phoneInput = document.getElementById('formPhone');
    const serviceInput = document.getElementById('formService');
    const budgetInput = document.getElementById('formBudget');
    const msgInput = document.getElementById('formMessage');
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput?.value.trim().slice(0, 100) || 'Valued Client';
    const email = emailInput?.value.trim().slice(0, 200) || '';
    const phone = phoneInput?.value.trim().slice(0, 20) || '';
    const serviceVal = serviceInput?.value || 'ai';
    const serviceLabel = serviceLabels[serviceVal] || serviceInput?.options[serviceInput.selectedIndex]?.text || serviceVal;
    const budgetVal = budgetInput?.value || '50k-100k';
    const budgetInfo = budgetValues[budgetVal] || { min: 50000, max: 100000, label: '₹50,000 – ₹1,00,000' };
    const msg = msgInput?.value.trim().slice(0, 2000) || '';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('Please provide a valid email address.');
      return;
    }

    // Validate name (no HTML tags)
    if (/<[^>]*>/g.test(name)) {
      alert('Please enter a valid name.');
      return;
    }

    const prevBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting Inquiry...';
    }

    const leadRecord = {
      name,
      email,
      phone,
      projectType: serviceLabel,
      project_type: serviceLabel,
      addons: msg ? `Message: ${msg}` : 'Direct Contact Form Inquiry',
      maintenance: `Estimated Budget: ${budgetInfo.label}`,
      tier: 'Direct Contact Form',
      totalPrice: budgetInfo.max,
      total_price: budgetInfo.max,
      currency: 'INR',
      status: 'new',
      timestamp: new Date().toISOString()
    };

    // 1. Save to localStorage for instant local Admin CRM pickup
    try {
      const existingLeads = JSON.parse(localStorage.getItem('savrajas_quote_leads') || '[]');
      existingLeads.push(leadRecord);
      localStorage.setItem('savrajas_quote_leads', JSON.stringify(existingLeads));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('[ContactForm] Local save error:', err);
    }

    // 2. Transmit to Supabase Cloud CRM (savrajas_leads table)
    try {
      await pushLeadToCloud(leadRecord);
    } catch (err) {
      console.warn('[ContactForm] Supabase cloud push error:', err);
    }

    // 3. Show feedback toast
    // Sanitize user inputs to prevent XSS when rendering in innerHTML
    const sanitize = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    if (toast && toastText) {
      toastText.innerHTML = `<strong>Inquiry Received, ${sanitize(name)}!</strong><br>We've logged your request for <strong>${sanitize(serviceLabel)}</strong>. Our team will contact you at <strong>${sanitize(phone || email)}</strong> within 24 hours.`;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 6000);
    }

    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = prevBtnText || 'Send Project Inquiry';
    }
  });
}

/* ==========================================================================
   6. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btt = document.getElementById('backToTop');
  if (!btt) return;

  btt.addEventListener('click', () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
