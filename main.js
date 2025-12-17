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
      nav_top: "About me",
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
      nav_top: "Про мене ↑",
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
      waifu_cap: "Додай арт у <code>/assets</code> і заміни це зображення.",
      stack_chip: "Арсенал",
      stack_sub: "Чим я користуюсь (і що вчу далі).",
      stack_title: "Технології",
      stack_icons_title: "Основні іконки",
      stack_badges_toggle: "Показати бейджі Shields",
      waifu_stack_cap: "Слот арту секції — заміни на PNG/WebP.",
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
      waifu_lore_cap: "Ще один слот персонажа. Можна міняти будь-коли.",
      contact_chip: "Викликати мене",
      contact_sub: "Найшвидше: Telegram.",
      contact_title: "Контакти",
      email_k: "Пошта",
      copy_btn: "Копіювати",
      contact_note: "Порада: заміни SVG-заглушки в <code>/assets</code> на свій WebP/PNG — буде максимум аніме-енергії.",
      btn_email: "Надіслати лист",
      btn_top: "На початок",
      waifu_contact_cap: "Фінальний слот персонажа. (Так, її теж міняй.)",
      footer_made: "Зроблено для GitHub Pages • Без збірки • CDN бібліотеки",
      toast_copied: "Скопійовано ✨",
      toast_failed: "Не вдалось скопіювати"
    }
  };

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
    const nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('uk') ? 'ua' : 'en';
  })();

  applyLang(initialLang);
  $('#langBtn')?.addEventListener('click', () => {
    const next = root.dataset.lang === 'en' ? 'ua' : 'en';
    applyLang(next);
  }, { passive: true });

  // ===== Lazy images (fast-scroll safe) =====
  function lazyLoadImages() {
    const imgs = $$('img[data-src]');
    if (!imgs.length) return;

    const load = async (img) => {
      const src = img.dataset.src;
      if (!src) return;
      img.removeAttribute('data-src');
      img.src = src;
      try { if (img.decode) await img.decode(); } catch {}
      img.classList.add('is-loaded');
    };

    if (!('IntersectionObserver' in window)) {
      imgs.forEach(img => load(img));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        load(e.target);
      }
    }, { rootMargin: '1800px 0px', threshold: 0.01 });

    imgs.forEach(img => io.observe(img));

    // Idle preload: helps when user scrolls very fast on first load
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 220));
    idle(() => {
      imgs.slice(0, 6).forEach(img => img.dataset.src && load(img));
    });
  }
  lazyLoadImages();

  // ===== Progress bar (rAF-throttled) =====
  const progressBar = $('#progressBar');
  let scrollScheduled = false;

  const updateProgress = () => {
    scrollScheduled = false;
    if (!progressBar) return;
    const h = document.documentElement;
    const max = Math.max(1, h.scrollHeight - h.clientHeight);
    const p = (h.scrollTop / max) * 100;
    progressBar.style.width = p.toFixed(2) + '%';
  };

  document.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  // ===== Copy email =====
  const toast = (() => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);

    let t = null;
    return (msg) => {
      el.textContent = msg;
      el.classList.add('is-on');
      clearTimeout(t);
      t = setTimeout(() => el.classList.remove('is-on'), 1400);
    };
  })();

  $('#copyEmail')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const email = btn?.dataset?.copy;
    if (!email) return;
    const dict = i18n[root.dataset.lang] || i18n.en;
    try {
      await navigator.clipboard.writeText(email);
      toast(dict.toast_copied);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast(dict.toast_copied);
      } catch {
        toast(dict.toast_failed);
      }
    }
  });

  // ===== Smooth theme blending (scroll-scrub, very smooth) =====
  function initThemeBlend() {
    const themed = $$('[data-theme]');
    if (!themed.length) return;

    const getAbsTop = (el) => el.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop || 0);

    // Parse hex like #aabbcc
    const hexToRgb = (hex) => {
      if (!hex) return [0, 0, 0];
      let h = String(hex).trim().replace('#', '');
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      const n = parseInt(h, 16);
      if (!Number.isFinite(n)) return [0, 0, 0];
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const mixRgb = (a, b, t) => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
    const rgbStr = (c) => `rgb(${c[0]} ${c[1]} ${c[2]})`;

    // Keyframes
    let frames = [];
    const recalc = () => {
      frames = themed.map((s) => ({
        el: s,
        top: getAbsTop(s),
        bg0: s.dataset.bg0,
        bg1: s.dataset.bg1,
        accent: s.dataset.accent,
        accent2: s.dataset.accent2,
        // pre-parse for speed
        _bg0: hexToRgb(s.dataset.bg0),
        _bg1: hexToRgb(s.dataset.bg1),
        _ac1: hexToRgb(s.dataset.accent),
        _ac2: hexToRgb(s.dataset.accent2),
      })).sort((a, b) => a.top - b.top);
    };
    recalc();

    const themeColor = document.querySelector('meta[name="theme-color"]');

    let lastKey = '';
    let lastEmit = 0;

    const setVars = (bg0, bg1, accent, accent2) => {
      // Avoid re-setting if identical (saves style recalcs)
      const key = bg0 + '|' + bg1 + '|' + accent + '|' + accent2;
      if (key === lastKey) return;
      lastKey = key;

      root.style.setProperty('--bg0', bg0);
      root.style.setProperty('--bg1', bg1);
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent2', accent2);

      // Throttle themechange for petals gradient rebuild
      const now = performance.now();
      if (now - lastEmit > 140) {
        lastEmit = now;
        window.dispatchEvent(new CustomEvent('themechange'));
      }

      // Keep browser UI theme color close (no need each frame but cheap)
      if (themeColor) themeColor.setAttribute('content', bg0);
    };

    const headerOffset = 86;
    const probeFrac = 0.28; // point inside viewport for stable blending

    let scheduled = false;

    const update = () => {
      scheduled = false;
      if (!frames.length) return;

      const doc = document.documentElement;
      const y = (window.scrollY || doc.scrollTop || 0);
      const vh = window.innerHeight || doc.clientHeight || 1;
      const probe = y + headerOffset + (vh * probeFrac);

      // Reduced motion: snap to the nearest active section (no blending)
      if (reduceMotion) {
        // bottom -> last
        const maxY = Math.max(0, doc.scrollHeight - doc.clientHeight);
        if (y >= maxY - 2) {
          const last = frames[frames.length - 1];
          setVars(last.bg0, last.bg1, last.accent, last.accent2);
          return;
        }
        let i = 0;
        while (i + 1 < frames.length && frames[i + 1].top <= probe) i++;
        const cur = frames[i];
        setVars(cur.bg0, cur.bg1, cur.accent, cur.accent2);
        return;
      }

      // Clamp to ends
      if (probe <= frames[0].top) {
        const f = frames[0];
        setVars(f.bg0, f.bg1, f.accent, f.accent2);
        return;
      }

      const maxY = Math.max(0, doc.scrollHeight - doc.clientHeight);
      if (y >= maxY - 2) {
        const last = frames[frames.length - 1];
        setVars(last.bg0, last.bg1, last.accent, last.accent2);
        return;
      }

      // Find segment [i, i+1]
      let i = 0;
      while (i + 1 < frames.length && frames[i + 1].top <= probe) i++;

      const a = frames[i];
      const b = frames[Math.min(i + 1, frames.length - 1)];

      const span = Math.max(1, b.top - a.top);
      const t = clamp((probe - a.top) / span, 0, 1);

      // Mix and set as rgb(...) for smooth continuous updates
      const bg0 = rgbStr(mixRgb(a._bg0, b._bg0, t));
      const bg1 = rgbStr(mixRgb(a._bg1, b._bg1, t));
      const ac1 = rgbStr(mixRgb(a._ac1, b._ac1, t));
      const ac2 = rgbStr(mixRgb(a._ac2, b._ac2, t));
      setVars(bg0, bg1, ac1, ac2);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => { recalc(); schedule(); }, { passive: true });

    // Recalc after layout settles (images/fonts)
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 260));
    idle(() => { recalc(); schedule(); });

    // Initial apply
    schedule();
  }
  initThemeBlend();

  // ===== Smooth scroll (Lenis) + ScrollTrigger (NO double-raf) =====
  let lenis = null;
  const canLenis = highFX && window.Lenis && !reduceMotion;

  if (canLenis) {
    lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      smoothTouch: false
    });

    // Anchor click -> lenis scrollTo
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      if (id === '#top') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.0, easing: (t) => 1 - Math.pow(1 - t, 4) });
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70, duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4) });
    });

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      // Drive Lenis from GSAP ticker (single loop)
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.on('scroll', ScrollTrigger.update);
    } else {
      // fallback single RAF loop (still one loop)
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  } else {
    // Native smooth scroll for anchors (only if not reduced-motion)
    if (!reduceMotion) {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        if (id === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // ===== Animations (batched) =====
  function initAnimations() {
    if (reduceMotion || !window.gsap) return;

    // Split headings/subtitles (small amount only)
    try {
      const splitEls = $$('.split');
      splitEls.forEach((el) => new SplitType(el, { types: 'words,chars' }));
    } catch {}

    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Sections: one trigger per section (fine)
    gsap.utils.toArray('.section').forEach((sec) => {
      gsap.from(sec, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Cards: batch triggers for better perf (many cards)
    if (window.ScrollTrigger && ScrollTrigger.batch) {
      ScrollTrigger.batch('.card', {
        start: 'top 85%',
        once: false,
        onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: 14 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06, overwrite: true
        }),
        onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 14, duration: 0.35, ease: 'power2.out', stagger: 0.03, overwrite: true })
      });
    } else {
      gsap.utils.toArray('.card').forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
      });
    }

    // Waifu parallax: only in highFX
    if (highFX && window.ScrollTrigger) {
      gsap.utils.toArray('.waifu__frame').forEach((frame) => {
        gsap.to(frame, {
          y: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.55
          }
        });
      });
    }

    // Shine on primary buttons: only in highFX
    if (highFX) {
      gsap.utils.toArray('.btn .btn__shine').forEach((s) => {
        gsap.to(s, { xPercent: 55, duration: 2.6, ease: 'power2.inOut', repeat: -1, yoyo: true });
      });
    }
  }
  initAnimations();

  // ===== Active nav link (deterministic + last-section safe) =====
  function initActiveNav() {
    const links = $$('.nav__a');
    if (!links.length) return;

    const sections = links
      .map(l => l.getAttribute('href'))
      .filter(h => h && h.startsWith('#') && h !== '#')
      .filter(h => h !== '#top')
      .map(h => ({ href: h, el: document.querySelector(h) }))
      .filter(x => x.el);

    const getAbsTop = (el) => el.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop || 0);

    let ordered = [];
    const recalc = () => {
      ordered = sections
        .map(s => ({ ...s, top: getAbsTop(s.el) }))
        .sort((a, b) => a.top - b.top);
    };
    recalc();

    const setActive = (href) => {
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === href));
    };

    // Marker line (below fixed header). Using a probe point fixes "last section never reaches top" cases.
    const headerOffset = 86;
    const probeFrac = 0.28; // probe point inside viewport

    let scheduled = false;

    const update = () => {
      scheduled = false;
      if (!ordered.length) { setActive('#top'); return; }

      const doc = document.documentElement;
      const y = (window.scrollY || doc.scrollTop || 0);
      const vh = window.innerHeight || doc.clientHeight || 1;
      const probe = y + headerOffset + (vh * probeFrac);

      // Top state
      if (probe < ordered[0].top - 20) { setActive('#top'); return; }

      // Bottom state -> force last
      const maxY = Math.max(0, doc.scrollHeight - doc.clientHeight);
      if (y >= maxY - 2) { setActive(ordered[ordered.length - 1].href); return; }

      // Binary search: last section whose top <= probe
      let lo = 0, hi = ordered.length - 1, ans = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (ordered[mid].top <= probe) { ans = mid; lo = mid + 1; }
        else { hi = mid - 1; }
      }
      setActive(ordered[ans].href);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => { recalc(); schedule(); }, { passive: true });

    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
    idle(() => { recalc(); schedule(); });

    try { lenis?.on?.('scroll', schedule); } catch {}

    schedule();
  }
  initActiveNav();

  // ===== Sakura / petals canvas (cached gradient + adaptive DPR) =====
  function initPetals() {
    const canvas = $('#petals');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;
    let grad = null;
    let a1 = '#ff4bd8', a2 = '#4bf2ff';

    const computeDpr = () => {
      const raw = window.devicePixelRatio || 1;
      const px = (window.innerWidth * window.innerHeight);
      // cap DPR on huge screens for perf
      if (px > 2_000_000) return clamp(raw, 1, 1.5);
      return clamp(raw, 1, 2);
    };

    const refreshThemeColors = () => {
      const cs = getComputedStyle(root);
      a1 = (cs.getPropertyValue('--accent') || '#ff4bd8').trim();
      a2 = (cs.getPropertyValue('--accent2') || '#4bf2ff').trim();
      grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, a1);
      grad.addColorStop(1, a2);
    };

    const setSize = () => {
      dpr = computeDpr();
      W = Math.floor(window.innerWidth);
      H = Math.floor(window.innerHeight);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refreshThemeColors();
    };
    setSize();

    const maxPetals = highFX ? 22 : 12;
    const petals = Array.from({ length: maxPetals }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 6 + Math.random() * 10,
      vx: -0.25 - Math.random() * 0.55,
      vy: 0.35 + Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      vr: -0.015 + Math.random() * 0.03,
      wob: Math.random() * 2.4,
      ph: Math.random() * Math.PI * 2
    }));

    let running = !reduceMotion;
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden && !reduceMotion;
    }, { passive: true });

    window.addEventListener('themechange', () => {
      // rebuild gradient only, cheap
      refreshThemeColors();
    }, { passive: true });

    const drawPetal = (p, t) => {
      const wob = Math.sin(t * 0.0012 + p.ph) * p.wob;
      const x = p.x + wob;
      const y = p.y;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.75);

      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.quadraticCurveTo(p.r * 0.9, -p.r * 0.2, 0, p.r);
      ctx.quadraticCurveTo(-p.r * 0.9, -p.r * 0.2, 0, -p.r);
      ctx.closePath();

      ctx.fill();
      ctx.restore();
    };

    let lastT = 0;
    const step = (t) => {
      if (!running) return requestAnimationFrame(step);

      const dt = Math.min(32, t - lastT || 16);
      lastT = t;

      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = highFX ? 0.22 : 0.16;
      ctx.fillStyle = grad;

      for (const p of petals) {
        p.x += p.vx * (dt * 0.06);
        p.y += p.vy * (dt * 0.06);
        p.rot += p.vr * (dt * 0.9);

        if (p.y > H + 40) { p.y = -40; p.x = Math.random() * W; }
        if (p.x < -60) p.x = W + 60;

        drawPetal(p, t);
      }

      requestAnimationFrame(step);
    };

    if (!reduceMotion) requestAnimationFrame(step);

    window.addEventListener('resize', () => {
      setSize();
    }, { passive: true });
  }
  initPetals();

  // ===== Year =====
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Minimal toast styling =====
  const style = document.createElement('style');
  style.textContent = `
    .toast{
      position: fixed;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%) translateY(14px);
      padding: 10px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.14);
      background: rgba(0,0,0,.55);
      color: rgba(244,243,255,.92);
      font-size: 13px;
      backdrop-filter: blur(10px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 220ms ease, transform 220ms ease;
      z-index: 9999;
    }
    .toast.is-on{ opacity: 1; transform: translateX(-50%) translateY(0px); }
    @media (prefers-reduced-motion: reduce){ .toast{ transition:none; } }
  `;
  document.head.appendChild(style);

  // ===== Auto performance monitor -> LowFX mode =====
  // If we detect sustained low FPS, we drop the most expensive effects.
  let lowFX = false;
  let frames = 0;
  let acc = 0;
  let last = performance.now();
  const warmupUntil = last + 2200;

  function enableLowFX() {
    if (lowFX) return;
    lowFX = true;
    highFX = false;
    root.classList.add('lowfx');

    // If Lenis exists, destroy it to remove scroll overhead
    try { lenis?.destroy(); } catch {}
    lenis = null;

    // Also stop heavy continuous GSAP timelines (button shine) but keep scroll triggers
    if (window.gsap) {
      gsap.globalTimeline.getChildren(true, true, false).forEach(tl => {
        // kill only infinite ones to reduce CPU
        try {
          if (tl.repeat && tl.repeat() === -1) tl.kill();
        } catch {}
      });
    }
  }

  function fpsLoop(now) {
    const dt = now - last;
    last = now;
    if (dt > 0 && dt < 200) {
      frames++;
      acc += dt;
    }

    // check every ~30 frames after warmup
    if (now > warmupUntil && frames >= 30) {
      const fps = 1000 / (acc / frames);
      frames = 0; acc = 0;
      if (fps < 48) enableLowFX();
    }

    requestAnimationFrame(fpsLoop);
  }

  if (!reduceMotion) requestAnimationFrame(fpsLoop);
})();