// PRUEBA · Mesa de trabajo: reglas, guías con el cursor y etiquetas arrastrables
(function () {
    const desktop = matchMedia('(min-width: 900px)').matches && matchMedia('(pointer: fine)').matches;

    // ----- Reglas, guías y coordenadas (solo escritorio con ratón) -----
    if (desktop) {
        const mk = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; document.body.appendChild(d); return d; };
        const rx = mk('ruler ruler-x');
        const ry = mk('ruler ruler-y');
        mk('ruler ruler-corner');
        const inner = document.createElement('div'); inner.className = 'ry'; ry.appendChild(inner);
        const mx = document.createElement('i'); mx.className = 'ruler-mark'; rx.appendChild(mx);
        const my = document.createElement('i'); my.className = 'ruler-mark'; ry.appendChild(my);
        const gx = mk('guide guide-x'), gy = mk('guide guide-y');
        const coords = mk('coords', 'X 0000 · Y 0000');

        function labelsX() {
            rx.querySelectorAll('span').forEach(s => s.remove());
            for (let x = 0; x <= innerWidth; x += 100) { const s = document.createElement('span'); s.textContent = x; s.style.left = (22 + x) + 'px'; rx.appendChild(s); }
        }
        function labelsY() {
            inner.innerHTML = '';
            const h = document.documentElement.scrollHeight;
            for (let y = 0; y <= h; y += 100) { const s = document.createElement('span'); s.textContent = y; s.style.top = y + 'px'; inner.appendChild(s); }
        }
        labelsX(); labelsY();
        addEventListener('resize', () => { labelsX(); labelsY(); });
        addEventListener('load', labelsY);

        let sy = 0;
        function onScroll() {
            sy = scrollY;
            inner.style.transform = 'translateY(' + (-sy) + 'px)';
            ry.style.backgroundPositionY = (-sy) + 'px, ' + (-sy) + 'px';
        }
        onScroll(); addEventListener('scroll', onScroll, { passive: true });

        let lastX = 0, lastY = 0;
        addEventListener('pointermove', e => {
            document.body.classList.add('has-pointer');
            lastX = e.clientX; lastY = e.clientY;
            gx.style.left = e.clientX + 'px'; gy.style.top = e.clientY + 'px';
            mx.style.left = e.clientX + 'px'; my.style.top = (e.clientY - 22) + 'px';
            coords.textContent = 'X ' + String(Math.max(0, Math.round(e.clientX - 22))).padStart(4, '0') + ' · Y ' + String(Math.max(0, Math.round(e.clientY + scrollY - 22))).padStart(4, '0');
        });
        document.addEventListener('pointerleave', () => document.body.classList.remove('has-pointer'));
        addEventListener('scroll', () => {
            coords.textContent = 'X ' + String(Math.max(0, Math.round(lastX - 22))).padStart(4, '0') + ' · Y ' + String(Math.max(0, Math.round(lastY + scrollY - 22))).padStart(4, '0');
        }, { passive: true });
    }

    // Subtítulo que se escribe solo (máquina de escribir)
    const sub = document.querySelector('.hero-subtitle');
    if (sub && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const txt = sub.textContent.trim();
        sub.setAttribute('aria-label', txt);
        sub.innerHTML = '<span class="tw-done" aria-hidden="true"></span><i class="tw-caret" aria-hidden="true"></i><span class="tw-rest" aria-hidden="true">' + txt + '</span>';
        const done = sub.querySelector('.tw-done'), rest = sub.querySelector('.tw-rest');
        let i = 0;
        function tick() {
            i++;
            done.textContent = txt.slice(0, i);
            rest.textContent = txt.slice(i);
            if (i < txt.length) {
                const c = txt[i - 1];
                setTimeout(tick, /[.,]/.test(c) ? 260 : 24 + Math.random() * 30);
            } else {
                setTimeout(() => sub.classList.add('tw-end'), 2500);
            }
        }
        setTimeout(tick, 1100);
    }

    // Cursor-lente: círculo con "TÚ" en la punta del ratón que se transforma en el cuadro de inversión sobre cada marca
    if (matchMedia('(min-width: 769px) and (pointer: fine)').matches) {
        const mkEl = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; document.body.appendChild(d); return d; };
        const bg = mkEl('lz-bg');
        const ui = mkEl('lz-ui', '<i></i><i></i><i></i><i></i>');
        const you = mkEl('lz-you', 'TÚ');
        const W = 160, D = 14;
        let mx = -100, my = -100, x = -100, y = -100, w = D, h = D, tx = 0, ty = 0, tw = D, th = D, brand = null, running = false;

        function setSize(nw, nh) {
            w = nw; h = nh;
            [bg, ui].forEach(el => { el.style.width = nw + 'px'; el.style.height = nh + 'px'; });
            document.body.classList.toggle('lz-box', nw !== D);
        }
        function targets() {
            if (brand) {
                const r = brand.getBoundingClientRect();
                tw = W; th = r.height + 40;
                tx = Math.min(Math.max(mx - W / 2, r.left - 12), r.right - W + 12);
                ty = r.top - 20;
            } else { tw = D; th = D; tx = mx - D / 2; ty = my - D / 2; }
        }
        function frame() {
            targets();
            x += (tx - x) * 0.28; y += (ty - y) * 0.28;
            const t = 'translate(' + x + 'px,' + y + 'px)';
            bg.style.transform = t; ui.style.transform = t;
            you.style.transform = 'translate(' + (x + (brand ? w / 2 + 8 : D + 5)) + 'px,' + (y + (brand ? h / 2 + 10 : D + 3)) + 'px)';
            requestAnimationFrame(frame);
        }
        addEventListener('pointermove', e => {
            mx = e.clientX; my = e.clientY;
            if (!running) { running = true; x = mx - D / 2; y = my - D / 2; document.body.classList.add('lz-on'); requestAnimationFrame(frame); }
            document.body.classList.toggle('lz-off', !!(e.target.closest && e.target.closest('input, textarea, select, [contenteditable], .contacto-form')));
            const b = e.target.closest ? e.target.closest('.brand') : null;
            if (b !== brand) { brand = b; targets(); setSize(tw, th); }
        });
        document.addEventListener('pointerleave', () => { document.body.classList.remove('lz-on'); running = false; brand = null; setSize(D, D); });
        document.addEventListener('pointerenter', () => { document.body.classList.add('lz-on'); });
    }

    // Botón Hablemos: la etiqueta "TÚ" sigue al cursor
    document.querySelectorAll('.cta-canvas').forEach(b => {
        b.addEventListener('pointermove', e => {
            const r = b.getBoundingClientRect();
            b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            b.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // ----- Etiquetas arrastrables, como objetos de Illustrator -----
    const chips = document.querySelectorAll('.chip');
    chips.forEach(c => {
        ['tl', 'tr', 'bl', 'br'].forEach(p => { const i = document.createElement('i'); i.className = 'hd ' + p; c.appendChild(i); });
        let sx, sy2, ox = 0, oy = 0, drag = false;
        c.addEventListener('pointerdown', e => {
            chips.forEach(o => o.classList.remove('is-selected'));
            c.classList.add('is-selected');
            drag = true; sx = e.clientX; sy2 = e.clientY;
            ox = parseFloat(c.style.getPropertyValue('--dx')) || 0;
            oy = parseFloat(c.style.getPropertyValue('--dy')) || 0;
            c.setPointerCapture(e.pointerId);
        });
        c.addEventListener('pointermove', e => {
            if (!drag) return;
            c.style.setProperty('--dx', (ox + e.clientX - sx) + 'px');
            c.style.setProperty('--dy', (oy + e.clientY - sy2) + 'px');
        });
        const end = () => { drag = false; };
        c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
    });
    document.addEventListener('pointerdown', e => {
        if (!e.target.closest('.chip')) chips.forEach(o => o.classList.remove('is-selected'));
    });
})();

// Menú: cada sección tiene su color en la píldora
(function () {
    const colores = {
        inicio:    ['#efd128', '#111'],
        servicios: ['#99d196', '#111'],
        proyectos: ['#e84769', '#fff'],
        sobre:     ['#FF6529', '#fff'],
        contacto:  ['#88dafc', '#111']
    };
    const ind = document.querySelector('.pill-indicator');
    const nav = document.querySelector('.pill-nav');
    const links = document.querySelectorAll('.nav-links a');
    if (!ind || !nav || !links.length) return;
    links.forEach(l => { const k = colores[l.getAttribute('data-section')]; if (k) { l.style.setProperty('--chip', k[0]); l.style.setProperty('--ink', k[1]); } });
    function pintar() {
        const a = document.querySelector('.nav-links a.active') || links[0];
        const c = colores[a.getAttribute('data-section')];
        if (!c) return;
        ind.style.backgroundColor = c[0];
        nav.style.setProperty('--nav-ink', c[1]);
    }
    pintar();
    const mo = new MutationObserver(pintar);
    links.forEach(l => mo.observe(l, { attributes: true, attributeFilter: ['class'] }));
})();

// Menú móvil: abrir / cerrar el panel
(function () {
    const btn = document.getElementById('menuBtn');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;
    const scrim = document.createElement('div');
    scrim.className = 'menu-scrim';
    document.body.appendChild(scrim);
    function set(open) {
        document.body.classList.toggle('menu-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.querySelector('.mb-txt').textContent = open ? 'Cerrar' : 'Menú';
    }
    btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    scrim.addEventListener('click', () => set(false));
    nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    addEventListener('resize', () => { if (innerWidth > 768) set(false); });
})();

// Medidas reales en las etiquetas de la portada
(function () {
    const tag = document.querySelector('.artboard-tag');
    const sel = document.querySelector('.sel');
    const size = document.querySelector('.sel-size');
    function medir() {
        if (tag) tag.textContent = 'Inicio · Artboard 1 — ' + innerWidth + ' × ' + innerHeight;
        if (sel && size) { const r = sel.getBoundingClientRect(); size.textContent = 'W ' + Math.round(r.width) + ' px · H ' + Math.round(r.height) + ' px'; }
    }
    medir();
    addEventListener('resize', medir);
    addEventListener('load', medir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
})();

// Testimonios: notas arrastrables (escritorio) y carrusel con botones grandes (móvil)
(function () {
    const stage = document.getElementById('tStage');
    if (!stage) return;
    const notes = stage.querySelectorAll('.t-note');
    let z = 10;
    const fino = matchMedia('(min-width: 769px) and (pointer: fine)');
    notes.forEach(n => {
        let sx, sy, ox = 0, oy = 0, drag = false;
        n.addEventListener('pointerdown', e => {
            if (!fino.matches) return;
            drag = true; n.classList.add('is-drag'); n.style.zIndex = ++z;
            sx = e.clientX; sy = e.clientY;
            ox = parseFloat(n.style.getPropertyValue('--dx')) || 0; oy = parseFloat(n.style.getPropertyValue('--dy')) || 0;
            n.setPointerCapture(e.pointerId);
        });
        n.addEventListener('pointermove', e => {
            if (!drag) return;
            n.style.setProperty('--dx', (ox + e.clientX - sx) + 'px'); n.style.setProperty('--dy', (oy + e.clientY - sy) + 'px');
        });
        const fin = () => { drag = false; n.classList.remove('is-drag'); };
        n.addEventListener('pointerup', fin); n.addEventListener('pointercancel', fin);
    });
    const count = document.querySelector('.t-count');
    function indice() {
        const w = notes[0].getBoundingClientRect().width + 18;
        return Math.max(0, Math.min(notes.length - 1, Math.round(stage.scrollLeft / w)));
    }
    function pintar() { if (count) count.textContent = String(indice() + 1).padStart(2, '0') + ' / ' + String(notes.length).padStart(2, '0'); }
    stage.addEventListener('scroll', pintar, { passive: true });
    document.querySelectorAll('.t-btn').forEach(b => b.addEventListener('click', () => {
        const i = Math.max(0, Math.min(notes.length - 1, indice() + parseInt(b.dataset.dir, 10)));
        notes[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }));
    pintar();
})();

// Servicios: las etiquetas separadas por comas pasan a ser "chips"
(function () {
    document.querySelectorAll('.servicio-tags').forEach(p => {
        const partes = p.textContent.split(',').map(t => t.trim()).filter(Boolean);
        if (!partes.length) return;
        p.setAttribute('aria-label', partes.join(', '));
        p.innerHTML = partes.map(t => '<span class="svc-chip" aria-hidden="true">' + t + '</span>').join('');
    });
})();


/* Pegatina holográfica: el brillo sigue al puntero */
(function () {
    var a = document.querySelector('.sticker-logo'); var s = a && a.querySelector('.stk-body');
    if (!s) return;
    a.addEventListener('pointermove', function (e) {
        var r = a.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        s.style.setProperty('--hx', Math.round(x * 100) + '%'); s.style.setProperty('--hy', Math.round(y * 100) + '%');
        s.style.setProperty('--sx', Math.round(130 - x * 160) + '%');
    });
})();

// Título de la portada: se puede mover (arrastrar) y escalar (tiradores), como en Illustrator. Doble clic = restablecer
(function () {
  document.querySelectorAll('.sel, .servicios-title').forEach(function (sel) {
    const pos = { tl: [0, 0], tm: [.5, 0], tr: [1, 0], ml: [0, .5], mr: [1, .5], bl: [0, 1], bm: [.5, 1], br: [1, 1] };
    let tx = 0, ty = 0, s = 1, st = null;
    sel.style.transformOrigin = '0 0';
    function aplicar() {
        sel.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
        sel.style.setProperty('--s', s);
        dispatchEvent(new Event('resize'));
    }
    sel.addEventListener('pointerdown', e => {
        if ((e.pointerType === 'touch' && !el.classList.contains('free-sticker')) || e.button !== 0) return;
        const hd = e.target.closest('.hd');
        const r = sel.getBoundingClientRect();
        st = { P: [e.clientX, e.clientY], tx: tx, ty: ty, s: s, L: r.left - tx, Tp: r.top - ty, W: sel.offsetWidth, H: sel.offsetHeight, h: null };
        if (hd) { const k = Object.keys(pos).find(c => hd.classList.contains(c)); if (k) st.h = pos[k]; }
        sel.classList.add('is-dragging');
        sel.style.transition = 'none';
        sel.setPointerCapture(e.pointerId);
        e.preventDefault();
    });
    sel.addEventListener('pointermove', e => {
        if (!st) return;
        const dx = e.clientX - st.P[0], dy = e.clientY - st.P[1];
        if (!st.h) { tx = st.tx + dx; ty = st.ty + dy; }
        else {
            const f = st.h, a = [(1 - f[0]) * st.W, (1 - f[1]) * st.H];
            const v = [(f[0] * st.W) - a[0], (f[1] * st.H) - a[1]];
            const A = [st.L + st.tx + st.s * a[0], st.Tp + st.ty + st.s * a[1]];
            const d = [e.clientX - A[0], e.clientY - A[1]];
            const ns = Math.max(.4, Math.min(3, (d[0] * v[0] + d[1] * v[1]) / (v[0] * v[0] + v[1] * v[1])));
            s = ns; tx = st.tx + (st.s - ns) * a[0]; ty = st.ty + (st.s - ns) * a[1];
        }
        aplicar();
    });
    const fin = () => { st = null; sel.classList.remove('is-dragging'); };
    sel.addEventListener('pointerup', fin); sel.addEventListener('pointercancel', fin);
    sel.addEventListener('dblclick', () => {
        sel.style.transition = 'transform .45s cubic-bezier(.2,.9,.3,1.2)';
        tx = 0; ty = 0; s = 1; aplicar();
        setTimeout(() => { sel.style.transition = ''; }, 500);
    });
  });
})();

// Servicios (etiquetas) y marcas: también se pueden arrastrar. Doble clic = volver a su sitio
(function () {
    function arrastrable(el) {
        let x = 0, y = 0, st = null, movido = false;
        el.addEventListener('pointerdown', e => {
            if ((e.pointerType === 'touch' && !el.classList.contains('free-sticker')) || e.button !== 0) return;
            st = { px: e.clientX, py: e.clientY, x: x, y: y }; movido = false;
            el.setPointerCapture(e.pointerId);
            el.classList.add('is-dragging'); document.body.classList.add('lz-drag');
            el.style.transition = 'none';
        });
        el.addEventListener('pointermove', e => {
            if (!st) return;
            const dx = e.clientX - st.px, dy = e.clientY - st.py;
            if (!movido && Math.hypot(dx, dy) < 4) return;
            movido = true;
            x = st.x + dx; y = st.y + dy;
            el.style.translate = x + 'px ' + y + 'px';
        });
        const fin = () => { st = null; el.classList.remove('is-dragging'); document.body.classList.remove('lz-drag'); };
        el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', fin);
        el.addEventListener('click', e => { if (movido) { e.preventDefault(); e.stopPropagation(); movido = false; } }, true);
        el.addEventListener('dragstart', e => e.preventDefault());
        el.addEventListener('dblclick', e => {
            e.preventDefault();
            el.style.transition = 'translate .45s cubic-bezier(.2,.9,.3,1.2)';
            x = 0; y = 0; el.style.translate = '0px 0px';
            setTimeout(() => { el.style.transition = ''; }, 500);
        });
    }
    document.querySelectorAll('.svc-chip, .free-sticker').forEach(arrastrable);
})();

// Pegatina de la portada: el brillo sigue al puntero
(function () {
    const a = document.querySelector('.free-sticker'); if (!a) return;
    a.addEventListener('pointermove', e => {
        const r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        a.style.setProperty('--hx', Math.round(x * 100) + '%'); a.style.setProperty('--hy', Math.round(y * 100) + '%'); a.style.setProperty('--sx', Math.round(130 - x * 160) + '%');
    });
})();

/* Subrayador a mano alzada, desgastado en el centro y con las puntas macizas */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  /* Trazos con curvas amplias y algo de inclinación (nada de línea recta) */
  var trazos = [
    ['M3 15.5 C 30 11, 62 17.5, 100 13 S 160 10.5, 197 12', 'M197 16 C 160 18, 120 13.5, 82 17 S 25 18.5, 2 17'],
    ['M2 12.5 C 35 17, 70 10.5, 108 14.5 S 165 17, 198 12', 'M198 16.5 C 150 12.5, 105 19, 62 15.5 S 18 14, 3 17']
  ];
  var els = document.querySelectorAll('.highlight-text');
  function capa(t, cls, filtro) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'hl-draw ' + cls);
    svg.setAttribute('viewBox', '0 0 200 28');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.filter = 'url(#' + filtro + ')';
    t.forEach(function (d, k) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('pathLength', '1');
      p.setAttribute('class', 'hl-p hl-p' + (k + 1));
      svg.appendChild(p);
    });
    return svg;
  }
  els.forEach(function (el, i) {
    var t = trazos[i % trazos.length];
    el.appendChild(capa(t, 'hl-worn', 'hl-wear'));
    el.appendChild(capa(t, 'hl-ends', 'hl-clean'));
  });
  /* Si las dos partes están en la misma línea, el primer trazo cubre ambas */
  function unir() {
    if (els.length < 2) return;
    var a = els[0], b = els[1];
    var s = a.querySelectorAll('.hl-draw');
    a.classList.remove('hl-union'); b.classList.remove('hl-union-2');
    s.forEach(function (x) { x.style.width = ''; });
    var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    if (Math.abs(ra.top - rb.top) < 6 && ra.width > 0) {
      a.classList.add('hl-union'); b.classList.add('hl-union-2');
      s.forEach(function (x) { x.style.width = (rb.right - ra.left) * 1.06 + 'px'; });
    }
  }
  unir();
  window.addEventListener('resize', unir);
  window.addEventListener('load', unir);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(unir);

  /* Filtros: "hl-wear" (centro desgastado, suave) y "hl-clean" (puntas casi macizas) */
  var d = document.createElement('div');
  d.setAttribute('aria-hidden', 'true');
  d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  d.innerHTML = '<svg width="0" height="0">' +
    '<filter id="hl-wear" x="-3%" y="-15%" width="106%" height="130%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.03 0.06" numOctaves="2" seed="7" result="e"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="e" scale="8" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed="3" result="n"/>' +
    '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.7" result="m"/>' +
    '<feComposite in="d" in2="m" operator="in"/></filter>' +
    '<filter id="hl-clean" x="-3%" y="-15%" width="106%" height="130%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="1" seed="2" result="e"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="e" scale="4" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="2" seed="9" result="n"/>' +
    '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 0 0 0 0.05" result="m"/>' +
    '<feComposite in="d" in2="m" operator="in"/></filter></svg>';
  document.body.appendChild(d);
})();

/* ===== Ventana de proyecto (vídeo / imagen) con estética artboard ===== */
(function () {
  if (typeof abrirModal !== 'function' || typeof casos === 'undefined') return;
  var COL = ['#efd128', '#99d196', '#e84769', '#88dafc', '#FF6529'];
  var INK = ['#111', '#111', '#fff', '#111', '#fff'];
  var DATA = [
    { tipo: 'Vídeo · Kickstarter', stats: [['327.109 €', 'recaudados'], ['2.898', 'patrocinadores']],
      chips: ['Concepto', 'Guión', 'Locución', 'Grabación', 'Edición', 'Color grading', 'Diseño de sonido', 'Postproducción'] },
    { tipo: 'Vídeo · Kickstarter', stats: [['706.153 €', 'recaudados'], ['3.276', 'patrocinadores']],
      chips: ['Concepto', 'Producción integral', 'Postproducción', 'Contenido con IA'] },
    { tipo: 'Vídeo · Campaña', stats: [['Atresmedia', 'campaña de lanzamiento']],
      chips: ['Concepto', 'Guión', 'Locución', 'Grabación', 'Edición', 'Color grading', 'Postproducción con IA'] },
    { tipo: 'App móvil · B2C', stats: [['+3.700', 'usuarios usan la app del Hub'], ['310.500 €', 'de ingresos en la app móvil'], ['2', 'programas de salud (Control y ED)']],
      chips: ['UX/UI', 'Fases de entrenamiento', 'Contenido educativo', 'Ejercicios', 'Seguimiento de progreso'] },
    { tipo: 'App móvil · B2B2C', stats: [['5', 'dispositivos integrables']],
      chips: ['UX/UI', 'Programas prescritos', 'Ejercicios guiados', 'Informes de evolución', 'Contenido educativo'] }
  ];
  var $ = function (id) { return document.getElementById(id); };
  var actual = 0, modal = $('modal');
  var orig = window.abrirModal;

  function pintar(i) {
    var c = casos[i], d = DATA[i] || { tipo: '', stats: [], chips: [] };
    actual = i;
    var partes = c.title.split(' — ');
    $('modalTitle').textContent = partes[0];
    $('modalSub').textContent = partes[1] || '';
    $('modalNum').textContent = ('0' + (i + 1)).slice(-2);
    $('modalFile').textContent = 'Proyecto ' + ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + casos.length).slice(-2);
    $('modalTipo').textContent = d.tipo;
    var st = $('modalStats'); st.innerHTML = '';
    d.stats.forEach(function (s) {
      var b = document.createElement('div'); b.className = 'mi-stat';
      var v = document.createElement('strong'); v.textContent = s[0];
      var l = document.createElement('span'); l.textContent = s[1];
      b.appendChild(v); b.appendChild(l); st.appendChild(b);
    });
    var ch = $('modalChips'); ch.innerHTML = '';
    d.chips.forEach(function (t) { var s = document.createElement('span'); s.className = 'svc-chip'; s.textContent = t; ch.appendChild(s); });
    var mc = modal.querySelector('.modal-content');
    mc.style.setProperty('--c', COL[i % COL.length]);
    mc.style.setProperty('--ink', INK[i % INK.length]);
    modal.querySelector('.modal-video').classList.toggle('is-img', c.type === 'image');
    mc.classList.remove('mc-in'); void mc.offsetWidth; mc.classList.add('mc-in');
    var body = modal.querySelector('.modal-body'); if (body) body.scrollTop = 0;
  }
  window.abrirModal = function (i) { orig(i); pintar(i); };
  $('modalPrev').addEventListener('click', function () { window.abrirModal((actual + casos.length - 1) % casos.length); });
  $('modalNext').addEventListener('click', function () { window.abrirModal((actual + 1) % casos.length); });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') cerrarModal();
    else if (e.key === 'ArrowLeft') $('modalPrev').click();
    else if (e.key === 'ArrowRight') $('modalNext').click();
  });
})();

/* ===== Curva de Bézier editable: arrastra los puntos de anclaje y los tiradores ===== */
(function () {
  var svg = document.querySelector('svg.bezier'); if (!svg) return;
  var path = svg.querySelector('.bz-line');
  var lines = svg.querySelectorAll('.bz-handles line');
  var circs = svg.querySelectorAll('.bz-handles circle');
  var rects = svg.querySelectorAll('.bz-anchors rect');
  var INI = { a0: [20, 190], h0: [90, 10], h1i: [230, 10], a1: [280, 120], h1o: [330, 230], h2i: [400, 230], a2: [440, 60] };
  var P = JSON.parse(JSON.stringify(INI));

  function pintar() {
    path.setAttribute('d', 'M' + P.a0 + ' C ' + P.h0 + ', ' + P.h1i + ', ' + P.a1 + ' C ' + P.h1o + ', ' + P.h2i + ', ' + P.a2);
    var seg = [[P.a0, P.h0], [P.h1i, P.a1], [P.a1, P.h1o], [P.h2i, P.a2]];
    seg.forEach(function (s, i) { var l = lines[i]; l.setAttribute('x1', s[0][0]); l.setAttribute('y1', s[0][1]); l.setAttribute('x2', s[1][0]); l.setAttribute('y2', s[1][1]); });
    [P.h0, P.h1i, P.h1o, P.h2i].forEach(function (p, i) { circs[i].setAttribute('cx', p[0]); circs[i].setAttribute('cy', p[1]); });
    [P.a0, P.a1, P.a2].forEach(function (p, i) { rects[i].setAttribute('x', p[0] - 7); rects[i].setAttribute('y', p[1] - 7); });
    hits.forEach(function (h) { var p = P[h.k]; h.el.setAttribute('cx', p[0]); h.el.setAttribute('cy', p[1]); });
  }

  /* Zonas de agarre más grandes que los puntos */
  var NS = 'http://www.w3.org/2000/svg', gh = document.createElementNS(NS, 'g'); gh.setAttribute('class', 'bz-hits');
  var hits = ['h0', 'h1i', 'h1o', 'h2i', 'a0', 'a1', 'a2'].map(function (k) {
    var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', k[0] === 'a' ? 16 : 14); c.setAttribute('class', 'bz-hit bz-hit-' + (k[0] === 'a' ? 'a' : 'h')); c.dataset.k = k; gh.appendChild(c);
    return { k: k, el: c };
  });
  svg.appendChild(gh);

  function aPunto(e) {
    var m = svg.getScreenCTM().inverse(), p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    var q = p.matrixTransform(m);
    return [Math.max(-30, Math.min(490, Math.round(q.x * 10) / 10)), Math.max(-30, Math.min(270, Math.round(q.y * 10) / 10))];
  }
  function mover(k, q) {
    var d = [q[0] - P[k][0], q[1] - P[k][1]];
    function sum(n) { P[n] = [P[n][0] + d[0], P[n][1] + d[1]]; }
    if (k === 'a0') { sum('a0'); sum('h0'); }
    else if (k === 'a1') { sum('a1'); sum('h1i'); sum('h1o'); }
    else if (k === 'a2') { sum('a2'); sum('h2i'); }
    else if (k === 'h1i') { P.h1i = q; P.h1o = [2 * P.a1[0] - q[0], 2 * P.a1[1] - q[1]]; }
    else if (k === 'h1o') { P.h1o = q; P.h1i = [2 * P.a1[0] - q[0], 2 * P.a1[1] - q[1]]; }
    else { P[k] = q; }
  }

  var act = null;
  gh.addEventListener('pointerdown', function (e) {
    var k = e.target.dataset && e.target.dataset.k; if (!k || e.button !== 0) return;
    e.preventDefault(); act = { k: k, id: e.pointerId, el: e.target };
    e.target.setPointerCapture(e.pointerId);
    svg.classList.add('bz-editing'); document.body.classList.add('lz-drag');
    var q = aPunto(e); act.off = [P[k][0] - q[0], P[k][1] - q[1]];
  });
  gh.addEventListener('pointermove', function (e) {
    if (!act) return;
    var q = aPunto(e); mover(act.k, [q[0] + act.off[0], q[1] + act.off[1]]); pintar();
  });
  function fin() { if (!act) return; act = null; svg.classList.remove('bz-editing'); document.body.classList.remove('lz-drag'); }
  gh.addEventListener('pointerup', fin); gh.addEventListener('pointercancel', fin);
  /* doble clic: restaurar la curva original */
  gh.addEventListener('dblclick', function () { P = JSON.parse(JSON.stringify(INI)); pintar(); });

  /* Cuando termina el dibujado inicial, quitamos el trazo discontinuo para que la curva pueda crecer */
  function listo() { svg.classList.add('bz-ready'); }
  path.addEventListener('animationend', listo); setTimeout(listo, 3200);
  pintar();
})();

/* ===== Reseñas en vídeo: vista previa al pasar el ratón + reproductor ===== */
(function () {
  var cards = [].slice.call(document.querySelectorAll('.vr-card'));
  var modal = document.getElementById('vrModal'); if (!cards.length || !modal) return;
  var v = document.getElementById('vrVideo'), idx = 0;
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Vista previa muda al pasar el ratón (solo con ratón) */
  if (hover) cards.forEach(function (c) {
    var pv = c.querySelector('video'); if (!pv) return;
    c.addEventListener('mouseenter', function () {
      if (!pv.src) pv.src = pv.dataset.src;
      try { pv.currentTime = 4; } catch (e) {}
      pv.play().then(function () { c.classList.add('is-prev'); }).catch(function () {});
    });
    c.addEventListener('mouseleave', function () { pv.pause(); c.classList.remove('is-prev'); });
  });

  function pad(n) { return ('0' + n).slice(-2); }
  function abrir(i) {
    idx = (i + cards.length) % cards.length;
    var c = cards[idx];
    v.src = c.dataset.video; v.currentTime = 0;
    document.getElementById('vrFile').textContent = 'Reseña ' + pad(idx + 1) + ' / ' + pad(cards.length);
    document.getElementById('vrOrg').textContent = c.dataset.name + ' · ' + c.dataset.org;
    modal.classList.toggle('single', cards.length < 2);
    modal.classList.add('active'); document.body.style.overflow = 'hidden';
    v.play().catch(function () {});
  }
  function cerrar() { modal.classList.remove('active'); v.pause(); v.removeAttribute('src'); v.load(); document.body.style.overflow = ''; }
  cards.forEach(function (c, i) { c.addEventListener('click', function () { cards.forEach(function (x) { x.classList.remove('is-prev'); var p = x.querySelector('video'); if (p) p.pause(); }); abrir(i); }); });
  [].forEach.call(document.querySelectorAll('.vr-more'), function (b) { b.addEventListener('click', function () { var it = b.closest('.vr-item'); var c = it && it.querySelector('.vr-card'); if (c) c.click(); }); });
  document.getElementById('vrX').addEventListener('click', cerrar);
  document.getElementById('vrPrev').addEventListener('click', function () { abrir(idx - 1); });
  document.getElementById('vrNext').addEventListener('click', function () { abrir(idx + 1); });
  modal.addEventListener('click', function (e) { if (e.target === modal) cerrar(); });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft' && cards.length > 1) abrir(idx - 1);
    else if (e.key === 'ArrowRight' && cards.length > 1) abrir(idx + 1);
  });
})();
