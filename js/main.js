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
  'elect-capital': {
    title: 'Elect Capital',
    category: 'Finance & Wealth Advisory',
    logo: 'assets/images/elect-capital.png',
    client: 'Elect Capital Markets',
    industry: 'Financial Services & Structured Investments',
    timeline: '4 Months',
    techStack: 'React, Next.js, Node.js, Highcharts, Tailwind CSS',
    desc: 'Savrajas engineered a complete corporate digital transformation for Elect Capital, combining an institutional-grade investment portal with a refined brand identity. The platform provides real-time portfolio intelligence, institutional investor disclosures, and bespoke wealth management advisory tools.'
  },
  'aitronik': {
    title: 'Aitronik',
    category: 'Technology & Automation',
    logo: 'assets/images/brain_trans.png',
    client: 'Aitronik Intelligence Ltd.',
    industry: 'Artificial Intelligence & Robotic Automation',
    timeline: '6 Months',
    techStack: 'Python, FastAPI, React, PyTorch, Docker, Kubernetes',
    desc: 'An AI-powered cognitive automation platform tailored for industrial workflows. Savrajas architected the neural model telemetry engine, visual pipeline orchestration interface, and real-time anomaly detection visualization.'
  },
  'toscano-forme': {
    title: 'Toscano Forme',
    category: 'Web Development & Luxury',
    logo: 'assets/images/toscano-forme.png',
    client: 'Toscano Forme Living',
    industry: 'Italian Luxury Furniture & Architecture',
    timeline: '3 Months',
    techStack: 'Next.js, Three.js, WebGL, GraphQL, Headless Shopify',
    desc: 'Crafted a bespoke digital flagship that reflects the timeless elegance of Italian furniture design. Features smooth WebGL material previews, room visualizers, and an ultra-fast headless e-commerce checkout.'
  },
  'army-welfare-trust': {
    title: 'Army Welfare Trust',
    category: 'Corporate & Institutional',
    logo: 'assets/images/awt-logo.png',
    client: 'Army Welfare Trust (AWT)',
    industry: 'Conglomerate & Institutional Governance',
    timeline: '5 Months',
    techStack: 'React, ASP.NET Core, SQL Server, Azure Cloud',
    desc: 'Designed a unified digital ecosystem serving over 18 diverse commercial units. Built high-security stakeholder portals, integrated enterprise annual reports, and centralized corporate communications.'
  },
  'indus-valley-yoga': {
    title: 'Indus Valley Yoga',
    category: 'Health & Wellness',
    logo: 'assets/images/logo-for-website.png',
    client: 'Indus Valley Yoga Sanctuary',
    industry: 'Holistic Health, Wellness & Education',
    timeline: '2.5 Months',
    techStack: 'Next.js, Tailwind CSS, Stripe Payments, Zoom API',
    desc: 'A serene, high-performance mindfulness portal featuring live studio session scheduling, on-demand video masterclasses, wellness retreat bookings, and interactive practitioner guidance.'
  },
  'nadra': {
    title: 'NADRA',
    category: 'Government & Public Sector',
    logo: 'assets/images/nadra.png',
    client: 'National Database and Registration Authority',
    industry: 'Digital Governance & Citizen Identity',
    timeline: '8 Months',
    techStack: 'Enterprise Microservices, React, Redis, Cyber-hardened API',
    desc: 'Engineered intuitive, accessible, and high-security web portals for national citizen registration workflows. Emphasized WCAG 2.1 AAA accessibility, multi-language localization, and sub-second response times.'
  },
  'muscat-insurance': {
    title: 'Muscat Insurance',
    category: 'Insurance & Claims Portal',
    logo: 'assets/images/muscat-insurance.png',
    client: 'Muscat Insurance Company',
    industry: 'Underwriting, Motor & Health Insurance',
    timeline: '4.5 Months',
    techStack: 'Vue.js, Node.js, PostgreSQL, OCR Document Scanner',
    desc: 'A modern consumer insurance portal featuring instant policy quotes, automated policy renewals, digital KYC, and a 3-step rapid claims submission flow with automated image damage assessment.'
  },
  'credible-lending': {
    title: 'Credible Lending',
    category: 'Finance & Lending',
    logo: 'assets/images/Logo-Dark.svg',
    client: 'Credible Lending Solutions',
    industry: 'Mortgage & Consumer Credit',
    timeline: '3.5 Months',
    techStack: 'React, Next.js, Plaid Integration, AWS Lambda',
    desc: 'Automated borrower pre-approval platform that streamlines credit assessments, financial institution synchronization, and dynamic loan scenario modeling in a frictionless, paperless interface.'
  },
  'bixits': {
    title: 'Bixits',
    category: 'Technology & SaaS',
    logo: 'assets/images/logo-2.jpg',
    client: 'Bixits Cloud Platforms',
    industry: 'DevOps & Observability Software',
    timeline: '4 Months',
    techStack: 'TypeScript, Go, React, ClickHouse, WebSockets',
    desc: 'Engineered a developer-first SaaS platform for cloud metrics and distributed tracing. Features interactive latency heatmaps, incident alerts, and microservice dependency graph generation.'
  },
  'zap-dental': {
    title: 'Zap Dental Billing',
    category: 'Healthcare & Revenue Cycle',
    logo: 'assets/images/zapDental.webp',
    client: 'Zap Dental Billing LLC',
    industry: 'Healthcare IT & Medical Revenue Management',
    timeline: '3 Months',
    techStack: 'React, Node.js, HIPAA-Compliant AWS Architecture',
    desc: 'A specialized medical billing operations hub for dental practices across North America. Automates insurance verification, claims tracking, and accounts receivable reconciliation.'
  },
  'a2z-olathe': {
    title: 'A2Z Olathe',
    category: 'Business & Logistics',
    logo: 'assets/images/A2Z_Logo_Full_Final.png',
    client: 'A2Z Logistics & Services',
    industry: 'Commercial Facilities & Dispatch',
    timeline: '3 Months',
    techStack: 'Next.js, Express, Google Maps Platform, Twilio SMS',
    desc: 'All-in-one multi-service management platform connecting commercial clients with on-demand facility maintenance, fleet dispatch, and automated client billing.'
  },
  'fine-gold-bullion': {
    title: 'Fine Gold Bullion',
    category: 'E-Commerce & Precious Metals',
    logo: 'assets/images/gold-bullion-1-e1724077520252.png',
    client: 'Fine Gold Bullion Traders',
    industry: 'Precious Metals Trading & Vault Storage',
    timeline: '5 Months',
    techStack: 'Next.js, WebSockets, Live Spot Feed API, Magento Engine',
    desc: 'High-frequency precious metals exchange web app featuring real-time London spot gold/silver feeds, dynamic cart locking against market volatility, and secure insured vault settlement.'
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
    return track.querySelectorAll('.project-card').length || 12;
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
    if (logoEl) {
      logoEl.src = data.logo;
      logoEl.alt = data.title;
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
