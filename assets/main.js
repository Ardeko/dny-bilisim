/* =========================================================
   DNY Bilişim — ortak script
   ========================================================= */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  // Bir modül hata verirse diğerleri çalışmaya devam etsin.
  // (Tek bir eksik HTML öğesi yüzünden sayfanın yarısının ölmesini engeller.)
  function safe(name, fn) {
    try { fn(); }
    catch (err) {
      if (window.console && console.warn) console.warn('[dny] modül atlandı: ' + name, err);
    }
  }

  /* ---------- 1. animasyonlu gradyan arka plan ---------- */
  function aurora(cv) {
    var ctx = cv.getContext('2d');
    if (!ctx) return;

    var w = 0, h = 0, dpr = 1, t = 0;
    var blobs = [], nodes = [], raf = null, visible = true, rect = null;
    var signalOn = cv.hasAttribute('data-signal');
    var MODE = cv.getAttribute('data-bg') || 'depth';   // 'depth' = 3B bulut, 'flat' = 2B ağ
    var spinY = 0, tiltX = 0, tiltY = 0;   // 3B döndürme durumu

    // imleç durumu (sayfa koordinatı -> canvas koordinatı)
    var cliX = -99999, cliY = -99999;   // en son imleç konumu (viewport)
    var pX = 0, pY = 0;                 // yumuşatılmış canvas içi konum
    var power = 0;                      // 0 = imleç dışarıda, 1 = içeride

    var PALETTE = [
      [46, 124, 246],   // mavi
      [122, 92, 240],   // mor
      [38, 198, 220],   // camgöbeği
      [26, 61, 133]     // derin lacivert
    ];

    function updateRect() { rect = cv.getBoundingClientRect(); }

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.5 : 2);
      w = cv.clientWidth; h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateRect();
      pX = w / 2; pY = h / 2;

      blobs = PALETTE.map(function (c, i) {
        return {
          c: c,
          x: (0.15 + 0.26 * i) * w,
          y: (i % 2 ? 0.66 : 0.3) * h,
          r: Math.max(w, h) * (0.42 + 0.1 * (i % 3)),
          sx: 0.00013 + i * 0.00005,
          sy: 0.00017 + i * 0.00004,
          ax: (0.16 + 0.05 * i) * w,
          ay: (0.15 + 0.05 * i) * h,
          p: i * 1.7,
          par: 10 + i * 7
        };
      });

      nodes = [];
      if (MODE === 'flat') {
        // 2B etkileşimli ağ: noktalar düzlemde serbest sürüklenir,
        // imleç yaklaşınca ona doğru esner ve çizgiyle bağlanır.
        var c2 = Math.round(clamp(w / 34, w < 520 ? 10 : 16, 48));
        for (var m2 = 0; m2 < c2; m2++) {
          nodes.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
            base: 0.6 + Math.random() * 1.5,
            sx: 0, sy: 0, k: 1
          });
        }
        return;
      }
      // 3B nokta bulutu: noktalar birim küre içine dağılır, her karede
      // döndürülüp perspektifle ekrana izdüşürülür. Kütüphane kullanılmaz.
      var count = Math.round(clamp(w / 30, w < 520 ? 14 : 22, 62));
      for (var n = 0; n < count; n++) {
        var u = Math.random(), v = Math.random(), rr = Math.cbrt(Math.random());
        var th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
        nodes.push({
          x: rr * Math.sin(ph) * Math.cos(th),
          y: rr * Math.sin(ph) * Math.sin(th) * 0.66,
          z: rr * Math.cos(ph),
          spin: 0.6 + Math.random() * 0.8,
          base: 0.7 + Math.random() * 1.5,
          sx: 0, sy: 0, sz: 0, k: 1
        });
      }
    }

    function draw() {
      if (!w || !h) { raf = requestAnimationFrame(draw); return; }
      if (!rect) updateRect();
      ctx.clearRect(0, 0, w, h);

      // --- imleç: canvas içinde mi, ne kadar güçlü ---
      var mX = cliX - rect.left, mY = cliY - rect.top;
      var inside = cliX > -99998 &&
                   mX > -50 && mY > -50 && mX < w + 50 && mY < h + 50;
      power += ((inside ? 1 : 0) - power) * 0.07;
      if (power > 0.004) { pX += (mX - pX) * 0.13; pY += (mY - pY) * 0.13; }
      var live = power > 0.01;

      // yatay/dikey paralaks: bulutlar imlece doğru hafifçe kayar
      var offX = live ? ((pX - w / 2) / w) * power : 0;
      var offY = live ? ((pY - h / 2) / h) * power : 0;

      // --- gradyan bulutlar ---
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach(function (b) {
        var x = b.x + Math.sin(t * b.sx * 1000 + b.p) * b.ax + offX * b.par;
        var y = b.y + Math.cos(t * b.sy * 1000 + b.p) * b.ay + offY * b.par;
        var g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        g.addColorStop(0, 'rgba(' + b.c[0] + ',' + b.c[1] + ',' + b.c[2] + ',0.34)');
        g.addColorStop(0.55, 'rgba(' + b.c[0] + ',' + b.c[1] + ',' + b.c[2] + ',0.10)');
        g.addColorStop(1, 'rgba(' + b.c[0] + ',' + b.c[1] + ',' + b.c[2] + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, b.r, 0, 6.2832); ctx.fill();
      });

      // imlecin altındaki yumuşak ışık
      if (live) {
        var gl = ctx.createRadialGradient(pX, pY, 0, pX, pY, 200);
        gl.addColorStop(0, 'rgba(120,180,255,' + (0.15 * power) + ')');
        gl.addColorStop(1, 'rgba(120,180,255,0)');
        ctx.fillStyle = gl;
        ctx.beginPath(); ctx.arc(pX, pY, 200, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      // --- ince ızgara ---
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (var gx = 0; gx < w; gx += 78) {
        ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, h); ctx.stroke();
      }
      for (var gy = 0; gy < h; gy += 78) {
        ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(w, gy + 0.5); ctx.stroke();
      }

      if (MODE === 'flat') {
        // ---- 2B etkileşimli ağ ----
        nodes.forEach(function (n) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.sx = n.x + offX * 26;
          n.sy = n.y + offY * 26;
          if (live) {
            var dfx = pX - n.sx, dfy = pY - n.sy;
            var dfd = Math.hypot(dfx, dfy) || 1;
            if (dfd < 220) {
              var pull2 = (1 - dfd / 220) * 30 * power;
              n.sx += dfx / dfd * pull2;
              n.sy += dfy / dfd * pull2;
            }
          }
        });
        ctx.lineWidth = 1;
        for (var fi = 0; fi < nodes.length; fi++) {
          for (var fj = fi + 1; fj < nodes.length; fj++) {
            var fa = nodes[fi], fb = nodes[fj];
            var fd = Math.hypot(fa.sx - fb.sx, fa.sy - fb.sy);
            if (fd < 138) {
              ctx.strokeStyle = 'rgba(180,214,255,' + (1 - fd / 138) * 0.15 + ')';
              ctx.beginPath(); ctx.moveTo(fa.sx, fa.sy); ctx.lineTo(fb.sx, fb.sy); ctx.stroke();
            }
          }
        }
        nodes.forEach(function (n) {
          var nr = 0;
          if (live) {
            var dm2 = Math.hypot(n.sx - pX, n.sy - pY);
            if (dm2 < 200) {
              nr = (1 - dm2 / 200) * power;
              ctx.strokeStyle = 'rgba(150,200,255,' + (nr * 0.38) + ')';
              ctx.beginPath(); ctx.moveTo(n.sx, n.sy); ctx.lineTo(pX, pY); ctx.stroke();
            }
          }
          ctx.fillStyle = 'rgba(214,232,255,' + (0.34 + nr * 0.5) + ')';
          ctx.beginPath(); ctx.arc(n.sx, n.sy, n.base * (1 + nr * 0.9), 0, 6.2832); ctx.fill();
        });
      } else {
      // --- 3B: döndür, perspektifle izdüşür ---
      // imleç kamerayı eğer; bulut kendi ekseninde yavaşça döner
      tiltY += (((live ? (pX - w / 2) / w : 0) * 0.9) - tiltY) * 0.045;
      tiltX += (((live ? (pY - h / 2) / h : 0) * 0.6) - tiltX) * 0.045;
      var ry = spinY + tiltY, rx = tiltX;
      var cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
      var cx3 = w / 2, cy3 = h * 0.5;
      var spread = Math.min(w, h) * 0.72;
      var CAM = 2.7;                       // kamera uzaklığı (küçüldükçe perspektif sertleşir)

      nodes.forEach(function (n) {
        // her nokta kendi hızında da döner: bulut cansız durmasın
        var a = spinY * n.spin * 0.35;
        var px0 = n.x * Math.cos(a) - n.z * Math.sin(a);
        var pz0 = n.x * Math.sin(a) + n.z * Math.cos(a);
        // Y ekseni
        var x1 = px0 * cY - pz0 * sY;
        var z1 = px0 * sY + pz0 * cY;
        // X ekseni
        var y2 = n.y * cX - z1 * sX;
        var z2 = n.y * sX + z1 * cX;

        var k = CAM / (CAM + z2);          // perspektif katsayısı
        n.k = k;
        n.sz = z2;
        n.sx = cx3 + x1 * spread * k;
        n.sy = cy3 + y2 * spread * k;
      });

      // uzaktakiler önce çizilsin (derinlik sırası)
      var order = nodes.slice().sort(function (a, b) { return b.sz - a.sz; });

      // bağlantılar — 3B mesafeye göre, uzakta soluk (sis etkisi)
      ctx.lineWidth = 1;
      for (var i = 0; i < order.length; i++) {
        for (var q = i + 1; q < order.length; q++) {
          var A = order[i], B = order[q];
          var d3 = Math.sqrt((A.sx - B.sx) * (A.sx - B.sx) + (A.sy - B.sy) * (A.sy - B.sy));
          var lim = 150 * ((A.k + B.k) / 2);
          if (d3 < lim) {
            var fog = Math.min(A.k, B.k);
            ctx.strokeStyle = 'rgba(170,208,255,' + (1 - d3 / lim) * 0.16 * fog + ')';
            ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(B.sx, B.sy); ctx.stroke();
          }
        }
      }

      // noktalar + imlece uzanan hatlar
      order.forEach(function (n) {
        var near = 0;
        if (live) {
          var dm = Math.hypot(n.sx - pX, n.sy - pY);
          if (dm < 210) {
            near = (1 - dm / 210) * power * n.k;
            ctx.strokeStyle = 'rgba(150,200,255,' + (near * 0.32) + ')';
            ctx.beginPath(); ctx.moveTo(n.sx, n.sy); ctx.lineTo(pX, pY); ctx.stroke();
          }
        }
        var alpha = (n.k - 0.62) / 0.95;                  // derinliğe göre parlaklık
        alpha = clamp(alpha, 0.06, 1) * 0.5 + near * 0.5;
        ctx.fillStyle = 'rgba(214,232,255,' + alpha + ')';
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, n.base * n.k * (1 + near * 0.8), 0, 6.2832);
        ctx.fill();
      });
      }

      // --- kesintisiz sinyal hattı (yalnızca data-signal taşıyan canvas'ta) ---
      if (signalOn) {
        var base = h * 0.88;
        var sg = ctx.createLinearGradient(0, 0, w, 0);
        sg.addColorStop(0.00, 'rgba(46,124,246,0)');
        sg.addColorStop(0.22, 'rgba(46,124,246,0.55)');
        sg.addColorStop(0.58, 'rgba(122,92,240,0.55)');
        sg.addColorStop(1.00, 'rgba(38,198,220,0)');
        ctx.strokeStyle = sg;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (var sx = 0; sx <= w; sx += 3) {
          var ph = (sx / w) * Math.PI * 2;
          var sy = base + Math.sin(ph * 2.2 + t * 0.85) * 7 + Math.sin(ph * 4.8 - t * 1.15) * 3.5;
          // ilerleyen darbe
          var pulse = ((sx / w) * 2.4 + t * 0.11) % 1;
          if (pulse < 0.05) sy -= Math.sin(pulse / 0.05 * Math.PI) * 26;
          sx ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
        }
        ctx.stroke();
      }

      if (!RM) { t += 0.016; spinY += 0.0022; }
      raf = requestAnimationFrame(draw);
    }

    size();
    window.addEventListener('resize', function () { size(); });
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('orientationchange', function () { setTimeout(size, 250); });

    if (RM) { draw(); cancelAnimationFrame(raf); return; }

    // imleç / parmak takibi
    var onPointer = function (e) { cliX = e.clientX; cliY = e.clientY; };
    var offPointer = function () { cliX = -99999; cliY = -99999; };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('pointerup', offPointer, { passive: true });
    document.addEventListener('pointerleave', offPointer);
    window.addEventListener('blur', offPointer);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !visible) { visible = true; raf = requestAnimationFrame(draw); }
          else if (!e.isIntersecting && visible) { visible = false; cancelAnimationFrame(raf); }
        });
      }, { threshold: 0 }).observe(cv);
    }
    raf = requestAnimationFrame(draw);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else if (visible) { raf = requestAnimationFrame(draw); }
    });
  }
  $$('.aurora').forEach(aurora);

  /* ---------- 1a. dil (TR / EN) ---------- */
  // Sitenin kaynak dili Türkçedir; İngilizce karşılıklar assets/i18n.js icindedir.
  // Sayfadaki metinler tek tek dolaşılır, sözlükte karşılığı olan çevrilir.
  var DICT = (window.DNY_I18N && window.DNY_I18N.en) || {};
  var lang = document.documentElement.getAttribute('lang') || 'tr';
  var langHooks = [];  // dil değişince çalışacak işler
  var i18nText = [];   // {node, tr, en}
  var i18nAttr = [];   // {el, attr, tr, en}

  function t(str) {
    return (lang === 'en' && DICT[str]) ? DICT[str] : str;
  }

  function collectI18n() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentNode;
      if (!parent) continue;
      var tag = parent.nodeName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'canvas') continue;
      if (parent.closest && parent.closest('[data-words]')) continue;  // kelime modülü kendi çevirir
      var raw = node.nodeValue;
      var key = raw.replace(/\s+/g, ' ').trim();
      if (!key || !DICT[key]) continue;
      // baştaki/sondaki boşluğu koru, gövdeyi değiştir (satır sonu içeren metinlerde de çalışır)
      var edges = raw.match(/^(\s*)[\s\S]*?(\s*)$/);
      i18nText.push({ node: node, tr: raw, en: edges[1] + DICT[key] + edges[2] });
    }
    $$('[data-i18n-word]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-word');
      if (DICT[k]) i18nText.push({ node: el.firstChild, tr: k, en: DICT[k] });
    });
    ['placeholder', 'aria-label', 'title', 'alt'].forEach(function (attr) {
      $$('[' + attr + ']').forEach(function (el) {
        var v = el.getAttribute(attr);
        if (v && DICT[v]) i18nAttr.push({ el: el, attr: attr, tr: v, en: DICT[v] });
      });
    });
    // sayfa başlığı ve açıklaması
    var desc = $('meta[name="description"]');
    if (desc && DICT[desc.getAttribute('content')]) {
      i18nAttr.push({ el: desc, attr: 'content', tr: desc.getAttribute('content'),
                      en: DICT[desc.getAttribute('content')] });
    }
  }

  function applyLang(next) {
    lang = next;
    document.documentElement.setAttribute('lang', next);
    i18nText.forEach(function (o) { o.node.nodeValue = next === 'en' ? o.en : o.tr; });
    i18nAttr.forEach(function (o) { o.el.setAttribute(o.attr, next === 'en' ? o.en : o.tr); });
    if (i18nTitleTr) document.title = next === 'en' ? (DICT[i18nTitleTr] || i18nTitleTr) : i18nTitleTr;
    $$('.langswitch button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === next;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (typeof syncThemeLabel === 'function') syncThemeLabel();
    langHooks.forEach(function (fn) { try { fn(next); } catch (e) {} });
    document.documentElement.classList.remove('i18n-wait');
  }

  var i18nTitleTr = document.title;
  collectI18n();
  applyLang(lang);

  $$('.langswitch button').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = b.getAttribute('data-lang');
      if (next === lang) return;
      applyLang(next);
      try { localStorage.setItem('dny-lang', next); } catch (e) {}
      var u = new URL(window.location.href);
      if (next === 'tr') u.searchParams.delete('lang'); else u.searchParams.set('lang', next);
      history.replaceState(null, '', u.toString());
    });
  });

  /* ---------- 1b. tema (açık / koyu) ---------- */
  // Üç durumlu tema: sistem -> açık -> koyu -> sistem
  var toggle = $('.themetoggle');
  var MODES = ['system', 'light', 'dark'];
  var LABELS = { system: 'Tema: sistem ayarı', light: 'Tema: açık', dark: 'Tema: koyu' };

  function systemDark() {
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { return false; }
  }
  function savedMode() {
    var v = null;
    try { v = localStorage.getItem('dny-theme'); } catch (e) {}
    return (v === 'light' || v === 'dark') ? v : 'system';
  }
  function syncThemeLabel() {
    if (!toggle) return;
    var mode = document.documentElement.getAttribute('data-theme-mode') || 'system';
    toggle.setAttribute('aria-label', t(LABELS[mode]));
    toggle.setAttribute('title', t(LABELS[mode]));
  }
  function applyThemeMode(mode) {
    var root = document.documentElement;
    root.setAttribute('data-theme-mode', mode);
    root.setAttribute('data-theme', (mode === 'dark' || (mode === 'system' && systemDark())) ? 'dark' : 'light');
    syncThemeLabel();
  }
  applyThemeMode(savedMode());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = MODES[(MODES.indexOf(savedMode()) + 1) % MODES.length];
      try {
        if (next === 'system') localStorage.removeItem('dny-theme');
        else localStorage.setItem('dny-theme', next);
      } catch (e) {}
      applyThemeMode(next);
    });
  }
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSchemeChange = function () { if (savedMode() === 'system') applyThemeMode('system'); };
    if (mq.addEventListener) mq.addEventListener('change', onSchemeChange);
    else if (mq.addListener) mq.addListener(onSchemeChange);
  } catch (e) {}

  /* ---------- 2. sabit başlık + ilerleme çubuğu ---------- */
  var header = $('.header');
  var progress = $('.progress');
  var callbar = $('.callbar');

  var lastY = 0;
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) {
      header.classList.toggle('is-stuck', y > 8);
      header.classList.toggle('is-shrink', y > 140);
      // aşağı kaydırırken gizlen, yukarı kaydırınca geri gel (okuma alanı kazandırır)
      var openMenu = document.body.classList.contains('no-scroll');
      if (!openMenu && y > 260 && y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 120) header.classList.remove('is-hidden');
      lastY = y;
    }
    if (progress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (clamp(y / (docH || 1), 0, 1) * 100) + '%';
    }
    if (callbar) callbar.classList.toggle('is-on', y > 420);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. mobil menü ---------- */
  var burger = $('.hamburger');
  var drawer = $('.drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('no-scroll', open);
    });
    $$('.drawer a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) burger.click();
    });
  }

  /* ---------- 4. görsel yoksa yazıya düş ---------- */
  $$('img[data-logo]').forEach(function (img) {
    var fb = img.parentNode.querySelector('[data-logo-fallback]');
    var alt = img.getAttribute('data-logo-alt');
    var tried = false;
    var fail = function () {
      if (alt && !tried && img.getAttribute('src') !== alt) { tried = true; img.src = alt; return; }
      img.hidden = true; if (fb) fb.hidden = false;
    };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- 5. görünüme girme ---------- */
  var reveals = $$('[data-reveal]');
  if (reveals.length) {
    if (RM || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var d = parseInt(entry.target.getAttribute('data-reveal'), 10) || 0;
          setTimeout(function () { entry.target.classList.add('is-in'); }, d + i * 60);
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 6. sayaçlar ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var ioNum = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        ioNum.unobserve(el);
        if (RM) { el.textContent = end + suffix; return; }
        var t0 = performance.now(), dur = 1400;
        (function tick(now) {
          var k = clamp((now - t0) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(end * eased) + (k === 1 ? suffix : '');
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { ioNum.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- 7. kart üzerinde ışık ---------- */
  if (!RM) {
    document.addEventListener('mousemove', function (e) {
      var c = e.target.closest('.card, .tile');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }

  /* ---------- 8. akordiyon ---------- */
  $$('.acc__item').forEach(function (item) {
    var btn = item.querySelector('.acc__btn');
    var panel = item.querySelector('.acc__panel');
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      $$('.acc__item.is-open').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        other.querySelector('.acc__panel').style.height = '0px';
        other.querySelector('.acc__btn').setAttribute('aria-expanded', 'false');
      });
      if (open) {
        panel.style.height = '0px';
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        panel.style.height = panel.firstElementChild.offsetHeight + 'px';
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  function remeasureAcc() {
    $$('.acc__item.is-open').forEach(function (item) {
      var panel = item.querySelector('.acc__panel');
      panel.style.height = panel.firstElementChild.offsetHeight + 'px';
    });
  }
  window.addEventListener('resize', remeasureAcc);
  window.addEventListener('orientationchange', function () { setTimeout(remeasureAcc, 250); });
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(remeasureAcc); }

  function openFromHash() {
    var id = (window.location.hash || '').slice(1);
    if (!id) return;
    var item = document.getElementById(id);
    if (!item || !item.classList.contains('acc__item') || item.classList.contains('is-open')) return;
    var btn = item.querySelector('.acc__btn');
    if (!btn) return;
    btn.click();
    setTimeout(function () {
      window.scrollTo({ top: item.getBoundingClientRect().top + window.scrollY - 100,
        behavior: RM ? 'auto' : 'smooth' });
    }, 80);
  }
  if ($('.acc')) { openFromHash(); window.addEventListener('hashchange', openFromHash); }

  /* ---------- 9. kopyala ---------- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var old = btn.textContent;
      var done = function (msg) {
        btn.textContent = msg;
        setTimeout(function () { btn.textContent = old; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(t('kopyalandı')); },
          function () { done(t('kopyalanamadı')); });
      } else { done(t('kopyalanamadı')); }
    });
  });

  /* ---------- 10. yıl ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- 11. iletişim formu ---------- */
  var form = $('#iletisimForm');
  if (form) {
    var HEDEF = 'destek@dny.com.tr';
    var konu = new URLSearchParams(window.location.search).get('konu');
    var konuSelect = $('#konu', form);
    if (konu && konuSelect) {
      var matched = false;
      $$('option', konuSelect).forEach(function (opt) {
        if (opt.value.toLowerCase() === konu.toLowerCase()) { opt.selected = true; matched = true; }
      });
      if (!matched) {
        var extra = document.createElement('option');
        extra.value = konu; extra.textContent = konu; extra.selected = true;
        konuSelect.appendChild(extra);
      }
      var msg = $('#mesaj', form);
      if (msg && !msg.value) msg.value = konu + ' ' + t('hakkında bilgi almak istiyorum.');
    }

    var setError = function (id, on) {
      var f = $('#' + id, form);
      if (f) f.closest('.field').classList.toggle('has-error', on);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (id) { var f = $('#' + id, form); return f ? f.value.trim() : ''; };
      var ad = val('ad'), eposta = val('eposta'), mesaj = val('mesaj');
      var ok = true;

      setError('ad', !ad); if (!ad) ok = false;
      var epostaOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta);
      setError('eposta', !epostaOk); if (!epostaOk) ok = false;
      setError('mesaj', !mesaj); if (!mesaj) ok = false;

      if (!ok) {
        var first = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (first && form.__gotoStep) {
          var panel = first.closest('.fpanel');
          if (panel) form.__gotoStep(parseInt(panel.getAttribute('data-panel'), 10) || 0);
        }
        if (first) first.focus();
        return;
      }

      var konuVal = val('konu') || 'Genel bilgi';
      var body =
        'Ad soyad: ' + ad + '\n' +
        'Kurum: ' + (val('kurum') || '-') + '\n' +
        'E-posta: ' + eposta + '\n' +
        'Telefon: ' + (val('telefon') || '-') + '\n' +
        'Konu: ' + konuVal + '\n\n' +
        mesaj;

      window.location.href = 'mailto:' + HEDEF
        + '?subject=' + encodeURIComponent(t('Web sitesi talebi') + ' — ' + konuVal + ' — ' + ad)
        + '&body=' + encodeURIComponent(body);

      var okBox = $('.form__ok', form);
      if (okBox) okBox.classList.add('is-on');
    });
  }

  /* ---------- 13. sol sinyal rayı ---------- */
  safe('rail', function () {
    var el = $('.rail');
    if (!el) return;
    var fill = $('.rail__fill', el), dot = $('.rail__dot', el);
    var pct = $('.rail__pct', el), sec = $('.rail__sec b', el);
    if (!fill || !dot) return;
    var marks = $$('[data-rail]');

    function upd() {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = clamp(window.scrollY / (docH || 1), 0, 1);
      var track = window.innerHeight - 278;
      fill.style.height = (track * p) + 'px';
      dot.style.transform = 'translateY(' + (track * p) + 'px)';
      if (pct) pct.textContent = '%' + Math.round(p * 100);

      var cur = marks[0];
      marks.forEach(function (m) {
        if (m.getBoundingClientRect().top <= window.innerHeight * 0.42) cur = m;
      });
      if (cur && sec) sec.textContent = t(cur.getAttribute('data-rail'));
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    langHooks.push(upd);
    upd();
  });

  /* ---------- 14. kelime kelime aydınlanma ---------- */
  safe('words', function () {
    var els = $$('[data-words]');
    if (!els.length) return;

    els.forEach(function (el) {
      var trText = (el.getAttribute('data-tr') || el.textContent).replace(/\s+/g, ' ').trim();
      el.setAttribute('data-tr', trText);
      var hi = (el.getAttribute('data-hi') || '').split('|');

      function build() {
        var text = t(trText);
        var mark = (lang === 'en' ? hi[1] : hi[0]) || '';
        el.textContent = '';
        text.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement('span');
          s.className = 'w';
          if (mark && part.toLowerCase().indexOf(mark.toLowerCase()) > -1) s.className += ' hi';
          s.textContent = part;
          el.appendChild(s);
        });
        el.__words = $$('.w', el);
        if (RM) el.__words.forEach(function (w) { w.classList.add('on'); });
      }
      build();
      langHooks.push(build);
    });

    if (RM) return;
    function upd() {
      els.forEach(function (el) {
        var ws = el.__words || [];
        if (!ws.length) return;
        var r = el.getBoundingClientRect(), vh = window.innerHeight;
        var prog = clamp((vh * 0.84 - r.top) / (r.height + vh * 0.32), 0, 1);
        var n = Math.round(prog * ws.length * 1.14);
        ws.forEach(function (w, i) { w.classList.toggle('on', i < n); });
      });
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  });

  /* ---------- 15. ikonlarda nabız ---------- */
  $$('.card__icon svg').forEach(function (svg) {
    var kids = svg.children;
    if (kids.length) kids[kids.length - 1].classList.add('pulse');
  });

  /* ---------- 16. başlık maskesi ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
  });

  /* ---------- 17. yukarı çık ---------- */
  safe('toTop', function () {
    var btn = $('.totop');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    });
    var upd = function () { btn.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.8); };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  });

  /* ---------- 18. canlı durum paneli (gerçek ölçüm) ---------- */
  safe('status', function () {
    var box = $('[data-status]');
    if (!box) return;
    var CFG = window.DNY_STATUS || {};
    if (CFG.mode === 'off') { box.hidden = true; return; }

    var rowsEl = $('.status__rows', box);
    var chart = $('.status__chart', box);
    var noteEl = $('.status__note', box);
    var banner = $('.status__banner', box);
    var history = [];
    var rows = {};
    var lastItems = [];        // dil değişince aynı verilerle yeniden çizmek için

    var EVERY = Math.round(Math.max(CFG.interval || 25000, 10000) / 1000);
    function noteText() {
      if (CFG.mode === 'uptimerobot') return t('İzleme kaydı') + ' · ' + t('yanıt süreleri her') + ' ' + EVERY + ' ' + t('saniyede yenilenir');
      if (CFG.mode === 'json') return t('İzleme sunucusu') + ' · ' + t('yanıt süreleri her') + ' ' + EVERY + ' ' + t('saniyede yenilenir');
      return t('Yanıt süreleri her') + ' ' + EVERY + ' ' + t('saniyede yenilenir') + '.';
    }

    function drawRow(item) {
      var r = rows[item.label];
      if (!r) {
        r = document.createElement('div');
        r.className = 'status__row';
        r.innerHTML = '<span class="lbl"></span><span class="ms"></span>' +
                      '<span class="st is-wait"><i></i><span class="w"></span></span>';
        rowsEl.appendChild(r);
        rows[item.label] = r;
      }
      $('.lbl', r).textContent = t(item.label);
      var msEl = $('.ms', r);
      msEl.textContent = item.ms == null ? '—' : item.ms + ' ms';
      msEl.className = 'ms ' + (item.ms == null ? 'na' : item.ms < 120 ? 'ok' : item.ms < 400 ? 'mid' : 'slow');
      var st = $('.st', r);
      st.className = 'st' + (item.up === true ? '' : item.up === false ? ' is-down' : ' is-wait');
      $('.w', st).textContent = t(item.up === true ? 'aktif' : item.up === false ? 'yanıt yok' : 'ölçülüyor');
    }

    function updateBanner() {
      if (!banner) return;
      var keys = Object.keys(rows), up = 0;
      keys.forEach(function (k) {
        if (!$('.st', rows[k]).classList.contains('is-down')) up++;
      });
      var allUp = keys.length > 0 && up === keys.length;
      banner.classList.toggle('is-warn', !allUp);
      $('b', banner).textContent = t(allUp ? 'Tüm sistemler çalışıyor' : 'Bazı servislerde sorun var');
      $('.up', banner).textContent = up;
      $('.all', banner).textContent = keys.length;
      try {
        $('.at', banner).textContent = t('son kontrol') + ' ' +
          new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false, timeZone: 'Europe/Istanbul' }).format(new Date());
      } catch (e) {}
    }

    function drawChart() {
      if (!chart || !history.length) return;
      var ctx = chart.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = chart.clientWidth, h = chart.clientHeight;
      if (!w || !h) return;
      chart.width = w * dpr; chart.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var max = Math.max.apply(null, history.concat([20]));
      var pt = function (v, i) {
        return [i / Math.max(history.length - 1, 1) * w, h - (v / max) * (h - 6) - 3];
      };
      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(143,212,240,.34)');
      g.addColorStop(1, 'rgba(143,212,240,0)');
      ctx.beginPath(); ctx.moveTo(0, h);
      history.forEach(function (v, i) { var q = pt(v, i); ctx.lineTo(q[0], q[1]); });
      ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath();
      history.forEach(function (v, i) { var q = pt(v, i); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
      ctx.strokeStyle = '#8FD4F0'; ctx.lineWidth = 1.4; ctx.stroke();
    }

    function push(items) {
      items.forEach(function (it) {
        var i = -1;
        lastItems.forEach(function (o, k) { if (o.label === it.label) i = k; });
        if (i > -1) lastItems[i] = it; else lastItems.push(it);
      });
      items.forEach(drawRow);
      updateBanner();
      var live = items.filter(function (i) { return typeof i.ms === 'number'; });
      if (live.length) {
        var avg = Math.round(live.reduce(function (a, b) { return a + b.ms; }, 0) / live.length);
        history.push(avg);
        if (history.length > 40) history.shift();
        drawChart();

        updateSum();
      }
    }

    function updateSum() {
      if (!history.length) return;
      var sum = $('.status__sum', box);
      if (!sum) {
        sum = document.createElement('div');
        sum.className = 'status__sum';
        sum.innerHTML = '<span><span class="k"></span> <b class="avg"></b></span>' +
                        '<span><span class="k2"></span> <b class="at2"></b></span>';
        if (chart) chart.parentNode.insertBefore(sum, chart.nextSibling);
      }
      $('.k', sum).textContent = t('ortalama yanıt');
      $('.k2', sum).textContent = t('en hızlı');
      $('.avg', sum).textContent = Math.round(history.reduce(function (a, b) { return a + b; }, 0) / history.length) + ' ms';
      $('.at2', sum).textContent = Math.min.apply(null, history) + ' ms';
    }

    // Dil değişince: satır adları, durum kelimeleri, üst şerit ve özet
    // aynı verilerle baştan çizilir — hiçbir alan eski dilde kalmaz.
    function retranslate() {
      lastItems.forEach(drawRow);
      updateBanner();
      updateSum();
      if (noteEl) noteEl.textContent = noteText();
    }

    // --- sayfa açılırken tarayıcının gerçekten ölçtüğü süreler ---
    function browserTimings() {
      var out = [];
      try {
        var nav = performance.getEntriesByType('navigation')[0];
        if (nav) {
          var ttfb = Math.round(nav.responseStart - nav.requestStart);
          if (ttfb >= 0) out.push({ label: 'Web sunucusu', up: true, ms: ttfb });
          var dl = Math.round(nav.responseEnd - nav.responseStart);
          if (dl >= 0) out.push({ label: 'İçerik teslimi', up: true, ms: dl });
        }
        var res = performance.getEntriesByType('resource') || [];
        var css = null, img = null;
        res.forEach(function (r) {
          if (css == null && /style\.css/.test(r.name)) css = Math.round(r.duration);
          if (img == null && /\.(png|jpg|svg)(\?|$)/.test(r.name)) img = Math.round(r.duration);
        });
        if (css != null) out.push({ label: 'Statik dosya sunucusu', up: true, ms: css });
        if (img != null) out.push({ label: 'Görsel sunucusu', up: true, ms: img });
      } catch (e) {}
      return out;
    }

    // --- canlı yoklama: aynı satırlar her turda gerçek istekle tazelenir ---
    function probeOne(p) {
      var t0 = performance.now();
      var url = p.url + (p.url.indexOf('?') > -1 ? '&' : '?') + '_=' + Date.now();
      if (!window.fetch) return Promise.resolve({ label: p.label, up: null, ms: null });
      return fetch(url, { mode: 'no-cors', cache: 'no-store' })
        .then(function () { return { label: p.label, up: true, ms: Math.round(performance.now() - t0) }; })
        .catch(function () { return { label: p.label, up: false, ms: null }; });
    }

    var first = true;
    function runProbes() {
      if (first) { var bt = browserTimings(); if (bt.length) push(bt); first = false; }
      var list = CFG.probes || [];
      if (!list.length) return;
      Promise.all(list.map(probeOne)).then(push);
    }

    function runUptimeRobot() {
      fetch('https://api.uptimerobot.com/v2/getMonitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'api_key=' + encodeURIComponent(CFG.uptimeRobotKey) +
              '&format=json&response_times=1&response_times_limit=1'
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.monitors) throw new Error('veri yok');
          push(d.monitors.map(function (m) {
            var rt = m.response_times && m.response_times[0];
            return {
              label: m.friendly_name,
              up: m.status === 2,
              ms: rt ? Math.round(rt.value) : (m.average_response_time ? Math.round(m.average_response_time) : null)
            };
          }));
        })
        .catch(function () { box.hidden = true; });
    }

    function runJson() {
      fetch(CFG.jsonUrl, { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (d) { push(Array.isArray(d) ? d : []); })
        .catch(function () { box.hidden = true; });
    }

    // 'auto': sunucudaki ajan durum.json üretmişse otomatik ona geçer,
    // yoksa tarayıcı ölçümüyle devam eder. Ajan kurulunca site kendiliğinden
    // gerçek sunucu verisine döner — hiçbir dosyayı elle değiştirmeye gerek yok.
    var agentOk = null;
    function runAuto() {
      if (agentOk === false) { runProbes(); return; }
      fetch(CFG.jsonUrl || 'durum.json', { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error('yok'); return r.json(); })
        .then(function (d) {
          if (!Array.isArray(d) || !d.length) throw new Error('boş');
          agentOk = true;
          if (noteEl) noteEl.textContent = t('İzleme ajanı') + ' · ' + t('yanıt süreleri her') +
            ' ' + EVERY + ' ' + t('saniyede yenilenir');
          push(d);
        })
        .catch(function () { agentOk = false; runProbes(); });
    }

    function tick() {
      if (CFG.mode === 'uptimerobot' && CFG.uptimeRobotKey) runUptimeRobot();
      else if (CFG.mode === 'json' && CFG.jsonUrl) runJson();
      else if (CFG.mode === 'auto') runAuto();
      else runProbes();
    }

    if (noteEl) noteEl.textContent = noteText();
    langHooks.push(retranslate);
    tick();
    setInterval(tick, Math.max(CFG.interval || 25000, 10000));
    window.addEventListener('resize', drawChart);
  });

  safe('infra', function () {
    var panel = $('[data-infra-panel]');
    if (!panel) return;
    var content = $('[data-infra-content]', panel);
    var step = $('.infra__step', panel);

    var DATA = {
      internet: ['İnternet', 'hizmetler.html#ag',
        'Dışarıdan gelen tüm trafik tek noktadan girer. Hat kapasitesi, yedek hat ve sabit IP ihtiyacı burada belirlenir.',
        ['Hat kapasitesi ve yedek hat planı', 'Sabit IP ve alan adı yönlendirmesi',
         'Kesinti anında ikinci hatta otomatik geçiş']],
      firewall: ['Güvenlik duvarı', 'hizmetler.html#guvenlik',
        'Kurumun dış dünyaya açılan tek kapısı. Kural tabanlı filtreleme, uzak erişim (VPN) ve saldırı engelleme burada çalışır.',
        ['Kural yazımı ve düzenli gözden geçirme', 'Uzaktan çalışma için güvenli VPN',
         'Sızma denemelerinin kaydı ve raporu']],
      switch: ['Switch ve kablolama', 'hizmetler.html#ag',
        'Ofisin omurgası. Kat panoları, kablo etiketleme ve port planı düzgün kurulmazsa her arıza saatler alır.',
        ['Yapılandırılmış kablolama ve pano düzeni', 'Port planı ve etiketleme',
         'Kat ve bina arası omurga']],
      server: ['Sunucu', 'hizmetler.html#donanim',
        'Ortak dosyalar, muhasebe ve iş uygulamaları burada durur. Kapasite, yetkilendirme ve bakım takvimi birlikte planlanır.',
        ['Sunucu kurulumu ve kapasite planı', 'Klasör yetkileri ve kullanıcı grupları',
         'Bakım takvimi ve güncelleme yönetimi']],
      backup: ['Yedekleme', 'hizmetler.html#yedekleme',
        'Yedeğin alınmış olması yetmez; geri dönebildiği düzenli olarak test edilir. Bir kopya da bina dışında tutulur.',
        ['Otomatik günlük yedek', 'Düzenli geri dönüş testi', 'Bina dışında ikinci kopya']],
      clients: ['İş istasyonları', 'hizmetler.html#destek',
        'Kullanıcıların günlük çalıştığı bilgisayarlar. Standart kurulum imajı sayesinde yeni cihaz saatler değil dakikalar içinde hazır olur.',
        ['Standart kurulum ve yazılım paketi', 'Uzaktan destek istemcisi',
         'Arızada aynı gün yerinde müdahale']],
      wifi: ['Kablosuz ağ', 'hizmetler.html#ag',
        'Kapsama ölçülerek planlanır. Misafir ağı kurum ağından ayrılır; ikisi birbirini görmez.',
        ['Kapsama ölçümü ve erişim noktası yerleşimi', 'Misafir ağının ayrılması',
         'Cihaz bazlı erişim yetkisi']],
      camera: ['Kamera sistemi', 'hizmetler.html#guvenlik',
        'Fiziksel güvenlik de aynı altyapının parçası. Kayıt süresi, görüş açısı ve uzaktan izleme birlikte planlanır.',
        ['Kamera yerleşimi ve görüş açısı planı', 'Kayıt süresi ve depolama hesabı',
         'Uzaktan izleme ve geçiş kontrolü']]
    };
    var order = ['internet', 'firewall', 'switch', 'server', 'backup', 'clients', 'wifi', 'camera'];
    var current = 'firewall';

    var TICK = '<svg viewBox="0 0 16 16" fill="none"><path d="M2 8.5l4 4 8-9" stroke="currentColor" ' +
               'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ARROW = '<svg viewBox="0 0 16 16" fill="none"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" ' +
                'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function render(id) {
      var d = DATA[id];
      if (!d) return;
      current = id;
      step.textContent = ('0' + (order.indexOf(id) + 1)).slice(-2) + ' / 0' + order.length;
      content.innerHTML =
        '<h3>' + t(d[0]) + '</h3><p>' + t(d[2]) + '</p><ul>' +
        d[3].map(function (b) { return '<li>' + TICK + '<span>' + t(b) + '</span></li>'; }).join('') +
        '</ul><a class="btn btn--grad" href="iletisim.html?konu=' + encodeURIComponent(t(d[0])) + '">' +
        t('Bu katmanla ilgili teklif alın') + ' ' + ARROW + '</a>';
      content.classList.remove('fade-swap');
      void content.offsetWidth;
      content.classList.add('fade-swap');

      $$('.infra__node').forEach(function (n) {
        n.classList.toggle('is-on', n.getAttribute('data-node') === id);
      });
      $$('.infra__chips button').forEach(function (b) {
        b.classList.toggle('is-on', b.getAttribute('data-node') === id);
      });
    }

    $$('.infra__node').forEach(function (n) {
      var id = n.getAttribute('data-node');
      n.addEventListener('click', function () { render(id); });
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); render(id); }
      });
    });
    $$('.infra__chips button').forEach(function (b) {
      b.addEventListener('click', function () { render(b.getAttribute('data-node')); });
    });

    langHooks.push(function () { render(current); });
    render(current);
  });

  /* ---------- 20. canlı kesintisiz çalışma oranı ---------- */
  safe('liveUptime', function () {
    var box = $('[data-live-uptime]');
    if (!box) return;
    var CFG = window.DNY_STATUS || {};
    if (CFG.mode !== 'uptimerobot' || !CFG.uptimeRobotKey) return;  // gerçek veri yoksa gizli kalır
    fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'api_key=' + encodeURIComponent(CFG.uptimeRobotKey) + '&format=json&custom_uptime_ratios=30'
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var ms = (d && d.monitors) || [];
        var vals = ms.map(function (m) { return parseFloat(m.custom_uptime_ratio); })
                     .filter(function (v) { return !isNaN(v); });
        if (!vals.length) return;
        var avg = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
        $('.val', box).textContent = '%' + avg.toFixed(2);
        box.hidden = false;
      })
      .catch(function () {});
  });

  /* ---------- 21. alt sayfa hero paralaksı ---------- */
  safe('parallax', function () {
    var el = $('[data-parallax]');
    if (!el || RM) return;
    var cv = $('.pagehead .aurora');
    function upd() {
      var y = window.scrollY;
      if (y > window.innerHeight) return;
      el.style.transform = 'translateY(' + (y * 0.16) + 'px)';
      el.style.opacity = String(clamp(1 - y / 520, 0, 1));
      if (cv) cv.style.transform = 'translateY(' + (y * 0.05) + 'px)';
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  });

  /* ---------- 22. hizmet bento kutuları ---------- */
  safe('serviceTiles', function () {
    var tiles = $$('.tile--svc');
    if (!tiles.length) return;

    function close(tile) {
      tile.classList.remove('is-open');
      $('.tile__more', tile).style.height = '0px';
      $('.tile__toggle', tile).setAttribute('aria-expanded', 'false');
    }
    function open(tile) {
      var more = $('.tile__more', tile);
      more.style.height = more.firstElementChild.offsetHeight + 'px';
      tile.classList.add('is-open');
      $('.tile__toggle', tile).setAttribute('aria-expanded', 'true');
    }

    tiles.forEach(function (tile) {
      $('.tile__toggle', tile).addEventListener('click', function () {
        var wasOpen = tile.classList.contains('is-open');
        tiles.forEach(function (o) { if (o !== tile && o.classList.contains('is-open')) close(o); });
        wasOpen ? close(tile) : open(tile);
      });
    });

    function remeasure() {
      tiles.forEach(function (tile) {
        if (!tile.classList.contains('is-open')) return;
        var more = $('.tile__more', tile);
        more.style.height = more.firstElementChild.offsetHeight + 'px';
      });
    }
    window.addEventListener('resize', remeasure);
    langHooks.push(function () { setTimeout(remeasure, 50); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);

    function fromHash() {
      var id = (window.location.hash || '').slice(1);
      if (!id) return;
      var tile = document.getElementById(id);
      if (!tile || !tile.classList.contains('tile--svc') || tile.classList.contains('is-open')) return;
      open(tile);
      setTimeout(function () {
        window.scrollTo({ top: tile.getBoundingClientRect().top + window.scrollY - 110,
          behavior: RM ? 'auto' : 'smooth' });
      }, 90);
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
  });

  /* ---------- 23. referans sektör haritası + filtre ---------- */
  safe('sectorMap', function () {
    var list = $('[data-reflist]');
    if (!list) return;
    var refs = $$('.ref', list);
    var chips = $$('[data-filters] button');
    var nodes = $$('.secnode');
    var spokes = $$('.secmap__svg .spoke');
    var active = 'all';

    function apply(key) {
      active = key;
      refs.forEach(function (r) {
        var show = key === 'all' || r.getAttribute('data-sector') === key;
        r.classList.toggle('is-off', !show);
        if (show) {
          r.classList.remove('is-in-filter');
          void r.offsetWidth;
          r.classList.add('is-in-filter');
        }
      });
      chips.forEach(function (c) { c.classList.toggle('is-on', c.getAttribute('data-filter') === key); });
      nodes.forEach(function (n) {
        n.classList.toggle('is-on', key !== 'all' && n.getAttribute('data-sector') === key);
      });
      spokes.forEach(function (sp) {
        sp.classList.toggle('is-on', key !== 'all' && sp.getAttribute('data-spoke') === key);
      });
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); });
    });
    nodes.forEach(function (n) {
      var key = n.getAttribute('data-sector');
      n.addEventListener('click', function () { apply(active === key ? 'all' : key); });
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(active === key ? 'all' : key); }
      });
    });
    apply('all');
  });

  /* ---------- 24. adımlı form ---------- */
  safe('formSteps', function () {
    var form = $('#iletisimForm[data-steps]');
    if (!form) return;
    var panels = $$('.fpanel', form);
    var marks = $$('.fstep', form);
    var next = $('[data-fnext]', form), back = $('[data-fback]', form), send = $('[data-fsend]', form);
    var REQ = [['ad'], ['mesaj'], ['eposta']];
    var i = 0;

    function show(n) {
      i = clamp(n, 0, panels.length - 1);
      panels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
      marks.forEach(function (m, k) {
        m.classList.toggle('is-on', k === i);
        m.classList.toggle('is-done', k < i);
      });
      back.hidden = i === 0;
      next.hidden = i === panels.length - 1;
      send.hidden = i !== panels.length - 1;
      var first = panels[i].querySelector('input,textarea,select');
      if (first && i > 0) first.focus({ preventScroll: true });
    }

    function valid(step) {
      var ok = true;
      REQ[step].forEach(function (id) {
        var f = $('#' + id, form);
        if (!f) return;
        var v = f.value.trim();
        var bad = !v || (id === 'eposta' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        f.closest('.field').classList.toggle('has-error', bad);
        if (bad && ok) { ok = false; f.focus({ preventScroll: true }); }
      });
      return ok;
    }

    next.addEventListener('click', function () { if (valid(i)) show(i + 1); });
    back.addEventListener('click', function () { show(i - 1); });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && i < panels.length - 1) {
        e.preventDefault();
        if (valid(i)) show(i + 1);
      }
    });
    show(0);
    form.__gotoStep = show;
  });

  /* ---------- 25. sıkça sorulan sorular ---------- */
  safe('faq', function () {
    var items = $$('.faq__item');
    if (!items.length) return;
    function close(it) {
      it.classList.remove('is-open');
      $('.faq__a', it).style.height = '0px';
      $('.faq__q', it).setAttribute('aria-expanded', 'false');
    }
    function open(it) {
      var a = $('.faq__a', it);
      a.style.height = a.firstElementChild.offsetHeight + 'px';
      it.classList.add('is-open');
      $('.faq__q', it).setAttribute('aria-expanded', 'true');
    }
    items.forEach(function (it) {
      $('.faq__q', it).addEventListener('click', function () {
        var wasOpen = it.classList.contains('is-open');
        items.forEach(function (o) { if (o !== it && o.classList.contains('is-open')) close(o); });
        wasOpen ? close(it) : open(it);
      });
    });
    function remeasure() {
      items.forEach(function (it) {
        if (!it.classList.contains('is-open')) return;
        var a = $('.faq__a', it);
        a.style.height = a.firstElementChild.offsetHeight + 'px';
      });
    }
    window.addEventListener('resize', remeasure);
    langHooks.push(function () { setTimeout(remeasure, 50); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    open(items[0]);   // ilk soru açık gelsin, sayfa boş görünmesin
  });

  /* ---------- 26. harita: yalnızca onayla yüklenir ---------- */
  safe('harita', function () {
    var box = $('[data-map]');
    if (!box) return;
    var btn = $('.btn', box);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-src');
      f.title = t('DNY Bilişim ofis konumu');
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(f);
      box.classList.add('map--yuklendi');
      try { sessionStorage.setItem('dny-harita', '1'); } catch (e) {}
    });
    // aynı oturumda bir kez onaylandıysa tekrar sorma
    try { if (sessionStorage.getItem('dny-harita') === '1') btn.click(); } catch (e) {}
  });

  /* ---------- 27. easter egg: 1996 arşiv sürümü ----------
     İki tetikleyici var:
       • klavyeden "1996" yazmak (masaüstü)
       • altbilgideki telif yılına 5 kez dokunmak (mobil)
     Her ikisi de nostaljik sunucu-odası tasarımına götürür. */
  safe('nostalji-easter-egg', function () {
    var HEDEF = 'dny-skeunostal.html';
    var KOD = '1996';
    var tampon = '';
    var gidiyor = false;

    function gecis() {
      if (gidiyor) return;
      gidiyor = true;
      try { sessionStorage.setItem('dny-arsiv-gecis', '1'); } catch (e) {}
      if (RM) { window.location.href = HEDEF; return; }
      var perde = document.createElement('div');
      perde.className = 'arsiv-gecis';
      perde.setAttribute('aria-hidden', 'true');
      perde.innerHTML = '<span>1996</span>';
      document.body.appendChild(perde);
      // perde tam kapandıktan sonra git; yarım kalırsa yine de gitsin
      setTimeout(function () { window.location.href = HEDEF; }, 820);
    }

    // klavye: yazı alanına yazarken tetiklenmesin
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (!/^[0-9]$/.test(e.key)) { tampon = ''; return; }
      tampon = (tampon + e.key).slice(-KOD.length);
      if (tampon === KOD) { tampon = ''; gecis(); }
    });

    // dokunmatik: telif yılına 5 kez
    var yil = $('[data-year]');
    if (yil) {
      var sayac = 0, sonSaat = 0;
      yil.setAttribute('title', '1996');
      yil.addEventListener('click', function () {
        var simdi = Date.now();
        sayac = (simdi - sonSaat > 1200) ? 1 : sayac + 1;   // ara verilirse baştan
        sonSaat = simdi;
        if (sayac >= 5) { sayac = 0; gecis(); }
      });
    }
  });

  /* ---------- 12. sayfa geçişi ---------- */
  if (!RM) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (!/\.html(\?|#|$)/.test(href)) return;
      var here = window.location.pathname.split('/').pop() || 'index.html';
      if (href.split('?')[0].split('#')[0] === here) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(function () { window.location.href = href; }, 220);
    });
    window.addEventListener('pageshow', function () { document.body.classList.remove('is-leaving'); });
  }
})();
