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

