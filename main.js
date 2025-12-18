(() => {
  const root = document.documentElement;
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // ===== Runtime flags =====
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const isDesktop = window.matchMedia?.('(min-width: 980px)')?.matches ?? false;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const effectiveType = navigator.connection?.effectiveType || '';
  const lowNet = /2g|slow-2g/.test(effectiveType);

  // High FX: desktop + motion allowed + not saving data + not low network
  let highFX = !reduceMotion && isDesktop && !saveData && !lowNet;

  // Heuristic: if device is likely weak, start in medium mode
  const hc = navigator.hardwareConcurrency || 8;
  const dm = navigator.deviceMemory || 8; // may be undefined in some browsers
  if (hc <= 4 || dm <= 4) highFX = false;

  // ===== Tiny helpers =====
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  // ===== i18n =====
  const i18n = {
    en: {
      skip: "Skip to content",
      nav_top: "To top",
      nav_stack: "Stack",
      nav_projects: "Projects",
      nav_lore: "Lore",
      nav_contact: "Contact",
      hero_kicker: "UA • Kyiv time • Desktop-first",
      hero_title: "Mrcocacola21",
      hero_sub: "Student • Data Software Engineering<br/>Building systems that feel like magic.",
      btn_github: "Open GitHub",
      btn_contact: "Message me",
      stat_role_k: "Role",
      stat_focus_k: "Focus",
      stat_focus_v: "Data • Software • Automation",
      stat_timezone_k: "Timezone",
      hint_scroll: "Scroll ↓ for sections / anchors",
      waifu_cap: "",
      stack_chip: "Tech Arsenal",
      stack_sub: "What I build with (and what I'm learning next).",
      stack_title: "Tools & Tech",
      stack_icons_title: "Core icons",
      stack_badges_toggle: "Show Shields-style badges",
      waifu_stack_cap: "",
      proj_chip: "Quest Log",
      proj_sub: "Selected repos — click to open.",
      proj_title: "Projects",
      proj1_desc: "Optimization engine + UI: iterations, plots, and cyber vibes.",
      proj2_desc: "A small bot/automation toolkit for Telegram interactions.",
      proj3_desc: "Course project: classic PHP backend + relational database.",
      proj4_desc: "OOP course work — UI + data table patterns.",
      proj5_desc: "Cleaning, joining, and exploring datasets in practice.",
      proj_card_extra_title: "Want more?",
      proj_card_extra_desc: "My GitHub has more experiments, labs, and side quests.",
      btn_all_repos: "All repos",
      btn_collab: "Collab?",
      waifu_proj_cap: "Wide banner slot — perfect for a key visual.",
      lore_chip: "Lore",
      lore_sub: "Short, no water. Just the vibe.",
      lore_title: "About me",
      lore_p1: "I'm Maksym Zienienkov — a student focusing on data + software engineering.",
      lore_p2: "I like turning messy problems into clean systems: automation, analytics, and tools with a solid UI.",
      lore_p3: "If it can be optimized, it probably will be. If it can be animated, it should stay smooth.",
      pill_1: "Performance-minded",
      pill_2: "Clean architecture",
      pill_3: "Data workflows",
      pill_4: "UI/UX taste",
      waifu_lore_cap: "s",
      contact_chip: "Summon Me",
      contact_sub: "Fastest way: Telegram.",
      contact_title: "Contact",
      email_k: "Email",
      copy_btn: "Copy",
      contact_note: "",
      btn_email: "Send email",
      btn_top: "Back to top",
      waifu_contact_cap: "",
      footer_made: "Made for GitHub Pages • No build • CDN libs",
      toast_copied: "Copied ✨",
      toast_failed: "Copy failed"
    },
    ua: {
      skip: "Перейти до контенту",
      nav_top: "Вгору",
      nav_stack: "Стек",
      nav_projects: "Проєкти",
      nav_lore: "Лор",
      nav_contact: "Контакти",
      hero_kicker: "UA • Час Києва • Desktop-first",
      hero_title: "Mrcocacola21",
      hero_sub: "Студент • Data Software Engineering<br/>Будую системи, що працюють як магія.",
      btn_github: "Відкрити GitHub",
      btn_contact: "Написати мені",
      stat_role_k: "Роль",
      stat_focus_k: "Фокус",
      stat_focus_v: "Дані • ПЗ • Автоматизація",
      stat_timezone_k: "Часовий пояс",
      hint_scroll: "Скроль ↓ до секцій / якорів",
      waifu_cap: "",
      stack_chip: "Арсенал",
      stack_sub: "Чим я користуюсь (і що вчу далі).",
      stack_title: "Технології",
      stack_icons_title: "Основні іконки",
      stack_badges_toggle: "Показати бейджі Shields",
      waifu_stack_cap: "",
      proj_chip: "Журнал квестів",
      proj_sub: "Вибрані репозиторії — натисни, щоб відкрити.",
      proj_title: "Проєкти",
      proj1_desc: "Оптимізація + UI: ітерації, графіки та вайб.",
      proj2_desc: "Невеликий набір автоматизації для Telegram взаємодій.",
      proj3_desc: "Курсова: класичний PHP бекенд + реляційна БД.",
      proj4_desc: "ООП курсова — UI + патерни таблиць даних.",
      proj5_desc: "Очищення, об’єднання та аналіз датасетів на практиці.",
      proj_card_extra_title: "Хочеш більше?",
      proj_card_extra_desc: "На GitHub ще багато лабораторних, експериментів і сайд-квестів.",
      btn_all_repos: "Усі репо",
      btn_collab: "Співпраця?",
      waifu_proj_cap: "Широкий банер — ідеально для key visual.",
      lore_chip: "Лор",
      lore_sub: "Коротко, без води. Тільки суть.",
      lore_title: "Про мене",
      lore_p1: "Я Максим Зієнєнков — студент, фокусуюсь на data + software engineering.",
      lore_p2: "Люблю перетворювати хаос у системи: автоматизація, аналітика та інструменти з хорошим UI.",
      lore_p3: "Якщо щось можна оптимізувати — значить буде. Якщо анімувати — то плавно.",
      pill_1: "Про продуктивність",
      pill_2: "Чиста архітектура",
      pill_3: "Data-пайплайни",
      pill_4: "Смак до UI/UX",
      waifu_lore_cap: "",
      contact_chip: "Викликати мене",
      contact_sub: "Найшвидше: Telegram.",
      contact_title: "Контакти",
      email_k: "Пошта",
      copy_btn: "Копіювати",
      contact_note: "",
      btn_email: "Надіслати лист",
      btn_top: "На початок",
      waifu_contact_cap: "",
      footer_made: "Зроблено для GitHub Pages • Без збірки • CDN бібліотеки",
      toast_copied: "Скопійовано ✨",
      toast_failed: "Не вдалось скопіювати"
    }
  };

/* ===================== LANG ===================== */
function applyLang(lang) {
  root.dataset.lang = lang;
  const dict = i18n[lang] || i18n.en;
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = dict[key];
    if (val == null) return;
    if (/[<>]/.test(val)) el.innerHTML = val;
    else el.textContent = val;
  });
  $('#langLabel').textContent = lang.toUpperCase();
  try { localStorage.setItem('lang', lang); } catch {}
}

const initialLang = (() => {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'ua' || saved === 'en') return saved;
  } catch {}
  return (navigator.language || '').toLowerCase().startsWith('uk') ? 'ua' : 'en';
})();

applyLang(initialLang);
$('#langBtn')?.addEventListener('click', () => {
  applyLang(root.dataset.lang === 'en' ? 'ua' : 'en');
}, { passive: true });

/* ===================== LAZY IMAGES ===================== */
function lazyLoadImages() {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  const load = async (img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    try { await img.decode?.(); } catch {}
    img.classList.add('is-loaded');
  };

  if (!('IntersectionObserver' in window)) {
    imgs.forEach(load);
    return;
  }

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      load(e.target);
    }
  }, { rootMargin: '1800px 0px', threshold: 0.01 });

  imgs.forEach(img => io.observe(img));
}
lazyLoadImages();

/* ===================== ONE SCROLL SCHEDULER ===================== */
let _scrollY = window.scrollY;
let _scrolling = false;
let _scrollTimer = 0;
let _raf = false;
const _scrollSubs = new Set();

const onScrollFrame = () => {
  _raf = false;
  _scrollSubs.forEach(fn => fn(_scrollY));
};

const scheduleScroll = () => {
  if (_raf) return;
  _raf = true;
  requestAnimationFrame(onScrollFrame);
};

const markScrolling = () => {
  _scrolling = true;
  clearTimeout(_scrollTimer);
  _scrollTimer = setTimeout(() => _scrolling = false, 120);
};

window.addEventListener('scroll', () => {
  _scrollY = window.scrollY;
  markScrolling();
  scheduleScroll();
}, { passive: true });

const isUserScrolling = () => _scrolling;

/* ===================== PROGRESS BAR ===================== */
const progressBar = $('#progressBar');
if (progressBar) {
  _scrollSubs.add(y => {
    const h = document.documentElement;
    const max = Math.max(1, h.scrollHeight - h.clientHeight);
    progressBar.style.width = ((y / max) * 100).toFixed(2) + '%';
  });
}

/* ===================== THEME BLEND ===================== */
function initThemeBlend() {
  const themed = $$('[data-theme]');
  if (!themed.length) return;

  const hex = h => {
    h = (h || '#000').replace('#','');
    if (h.length === 3) h = [...h].map(x=>x+x).join('');
    const n = parseInt(h,16);
    return [n>>16&255,n>>8&255,n&255];
  };

  let frames = [];
  const recalc = () => {
    frames = themed.map(s => ({
      top: s.getBoundingClientRect().top + _scrollY,
      bg0: hex(s.dataset.bg0),
      bg1: hex(s.dataset.bg1),
      ac1: hex(s.dataset.accent),
      ac2: hex(s.dataset.accent2)
    })).sort((a,b)=>a.top-b.top);
  };
  recalc();

  let lastT = -1, lastTime = 0;

  _scrollSubs.add(() => {
    const now = performance.now();
    if (now - lastTime < 33) return;

    const probe = _scrollY + 86 + innerHeight * 0.28;
    let i = 0;
    while (i+1 < frames.length && frames[i+1].top <= probe) i++;

    const a = frames[i];
    const b = frames[i+1] || a;
    const t = clamp((probe - a.top) / Math.max(1, b.top - a.top), 0, 1);
    if (Math.abs(t - lastT) < 0.012) return;

    lastT = t;
    lastTime = now;

    const mix = (x,y)=>`rgb(${x.map((v,i)=>Math.round(v+(y[i]-v)*t)).join(' ')})`;
    root.style.setProperty('--bg0', mix(a.bg0,b.bg0));
    root.style.setProperty('--bg1', mix(a.bg1,b.bg1));
    root.style.setProperty('--accent', mix(a.ac1,b.ac1));
    root.style.setProperty('--accent2', mix(a.ac2,b.ac2));
    window.dispatchEvent(new Event('themechange'));
  });

  window.addEventListener('resize', recalc, { passive:true });
}
initThemeBlend();

/* ===================== ✨ ANIMATIONS (PATCHED) ✨ ===================== */
function initAnimations() {
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // ⛔ VERY IMPORTANT
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });

  /* ===================== INITIAL STATE (NO JITTER) ===================== */
  gsap.set('.section', { autoAlpha: 0, y: 28 });
  gsap.set('.card', { autoAlpha: 0, y: 20 });

  /* ===================== SECTIONS ===================== */
  gsap.utils.toArray('.section').forEach(sec => {
    gsap.to(sec, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: sec,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true
      }
    });
  });

  /* ===================== CARDS (STAGGER) ===================== */
  ScrollTrigger.batch('.card', {
    start: 'top 88%',
    onEnter: batch =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
        immediateRender: false
      }),
    onLeaveBack: batch =>
      gsap.to(batch, {
        autoAlpha: 0,
        y: 20,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true
      })
  });

  /* ===================== WAIFU PARALLAX ===================== */
  if (highFX) {
    gsap.utils.toArray('.waifu__frame').forEach(frame => {
      gsap.to(frame, {
        y: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });
    });
  }

  /* ===================== BUTTON SHINE ===================== */
  if (highFX) {
    gsap.utils.toArray('.btn .btn__shine').forEach(el => {
      gsap.to(el, {
        xPercent: 60,
        duration: 2.8,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
      });
    });
  }

  /* ===================== FINAL, SINGLE REFRESH ===================== */
  const idle = window.requestIdleCallback || (fn => setTimeout(fn, 400));
  idle(() => {
    ScrollTrigger.refresh(true);
  });
}
initAnimations();

/* ===================== ACTIVE NAV ===================== */
function initActiveNav() {
  const links = $$('.nav__a');
  const sections = links.map(l => ({
    link: l,
    el: document.querySelector(l.hash)
  })).filter(x => x.el);

  let ordered = [];
  const recalc = () => {
    ordered = sections.map(s => ({
      ...s,
      top: s.el.getBoundingClientRect().top + _scrollY
    })).sort((a,b)=>a.top-b.top);
  };
  recalc();

  _scrollSubs.add(() => {
    const probe = _scrollY + 86 + innerHeight * 0.28;
    let cur = '#top';
    for (const s of ordered) if (s.top <= probe) cur = s.link.hash;
    links.forEach(l => l.classList.toggle('is-active', l.hash === cur));
  });

  window.addEventListener('resize', recalc, { passive:true });
}
initActiveNav();

/* ===================== PETALS ===================== */
function initPetals() {
  const c = $('#petals');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W,H;
  const resize = () => {
    W = c.width = innerWidth;
    H = c.height = innerHeight;
  };
  resize();
  addEventListener('resize', resize, { passive:true });

  const petals = Array.from({ length: highFX ? 22 : 12 }, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    vx: -0.4-Math.random(),
    vy: 0.4+Math.random(),
    r: 6+Math.random()*8
  }));

  const step = () => {
    if (isUserScrolling()) {
      requestAnimationFrame(step);
      return;
    }
    ctx.clearRect(0,0,W,H);
    ctx.globalAlpha = 0.2;
    petals.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if (p.y>H) p.y=-20;
      if (p.x<0) p.x=W;
      ctx.beginPath();
      ctx.ellipse(p.x,p.y,p.r,p.r*0.6,0,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
initPetals();

})();