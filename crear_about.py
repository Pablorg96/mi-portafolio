import re, shutil, sys

archivo_html = "index.html"
archivo_css = "style.css"
archivo_js = "script.js"

shutil.copy(archivo_html, archivo_html + ".bak2")
shutil.copy(archivo_css, archivo_css + ".bak2")
shutil.copy(archivo_js, archivo_js + ".bak2")

# ---------- 1) Reemplazar la sección "Sobre mí" por la nueva "About" ----------
with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

nueva_seccion = '''<!-- About -->
    <section class="about-section" id="sobre">
        <div class="container about-grid">
            <div class="about-col about-col-left">
                <h2 class="about-hola">¡Hola!</h2>
                <p class="about-summary reveal-blur">UX/UI Designer, Productor Audiovisual Senior y Diseñador Gráfico basado en Sevilla. Vengo del mundo de la Publicidad y las Relaciones Públicas, con un máster en Diseño Gráfico que me formó para entender cómo comunicar visualmente.</p>
            </div>

            <div class="about-col about-col-center">
                <div class="about-photo-tilt reveal-blur">
                    <div class="about-photo-card">
                        <img src="images/pablo-romero.jpg" alt="Pablo Romero">
                    </div>
                </div>
            </div>

            <div class="about-col about-col-right">
                <p class="about-detail reveal-blur">Hace años descubrí que el <strong>diseño</strong>, el <strong>vídeo</strong> y la <strong>tecnología</strong> no son disciplinas aisladas: son piezas de un mismo puzzle. En <strong>MYHIXEL</strong> he especializado mi experiencia en <strong>dirección audiovisual</strong>, <strong>diseño de producto</strong> y <strong>campañas 360º</strong>, liderando proyectos con cifras destacadas en Kickstarter (<strong>+$2.3M recaudados</strong>) y producciones emitidas en <strong>Atresmedia</strong>. También integro <strong>IA generativa</strong> en mis procesos para optimizar creatividad sin perder calidad. En paralelo, creo <strong>Cromántiko</strong>, un proyecto personal donde diseño e ilustro mensajes sociales que se plasman en serigrafía artesanal.</p>
            </div>
        </div>
    </section>'''

html_nuevo, n = re.subn(
    r'<!-- Sobre mí -->\s*<section class="sobre">.*?</section>',
    nueva_seccion,
    html,
    count=1,
    flags=re.DOTALL
)

if n == 0:
    print("AVISO: no encontré la sección 'Sobre mí' con ese formato exacto. No se tocó el HTML.")
else:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html_nuevo)
    print("HTML: sección 'Sobre mí' sustituida por la nueva sección 'About'.")

# ---------- 2) Añadir CSS al final de style.css ----------
css_nuevo = '''

/* About Section (3 columnas + tilt 3D) */
.about-section {
    background-color: #F4F4F0;
    color: #1A1A1A;
    padding: 120px 40px;
}

.about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 60px;
    align-items: stretch;
}

.about-col {
    display: flex;
    flex-direction: column;
}

.about-col-left {
    justify-content: space-between;
}

.about-hola {
    font-size: 64px;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    color: #1A1A1A;
}

.about-summary {
    font-size: 16px;
    line-height: 1.7;
    color: #1A1A1A;
    max-width: 320px;
}

.about-col-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.about-photo-tilt {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 3 / 4;
    perspective: 1000px;
}

.about-photo-card {
    width: 100%;
    height: 100%;
    border-radius: 24px;
    overflow: hidden;
    transform-style: preserve-3d;
    will-change: transform;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
}

.about-photo-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
}

.about-col-right {
    justify-content: center;
}

.about-detail {
    font-size: 18px;
    line-height: 1.8;
    color: #1A1A1A;
}

.about-detail strong {
    font-weight: 700;
}

@media (max-width: 900px) {
    .about-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .about-hola {
        font-size: 48px;
    }

    .about-summary {
        max-width: 100%;
    }

    .about-photo-tilt {
        max-width: 280px;
        margin: 0 auto;
    }
}

@media (max-width: 768px) {
    .about-section {
        padding: 80px 20px;
    }
}
'''

with open(archivo_css, "a", encoding="utf-8") as f:
    f.write(css_nuevo)
print("CSS: estilos de la sección About añadidos al final de style.css.")

# ---------- 3) Añadir JS del tilt 3D al final de script.js ----------
js_nuevo = '''

// About - Efecto Tilt 3D en la foto (sigue el ratón)
(function () {
    const tiltEl = document.querySelector('.about-photo-tilt');
    const card = document.querySelector('.about-photo-card');
    if (!tiltEl || !card) return;

    const maxTilt = 12; // grados máximos de inclinación

    const setRotateX = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3.out" });
    const setRotateY = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3.out" });
    const setScale = gsap.quickTo(card, "scale", { duration: 0.5, ease: "power3.out" });

    tiltEl.addEventListener('mousemove', (e) => {
        const rect = tiltEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentX = (x / rect.width) - 0.5;
        const percentY = (y / rect.height) - 0.5;

        setRotateY(percentX * maxTilt * 2);
        setRotateX(percentY * -maxTilt * 2);
        setScale(1.03);
    });

    tiltEl.addEventListener('mouseleave', () => {
        setRotateX(0);
        setRotateY(0);
        setScale(1);
    });
})();
'''

with open(archivo_js, "a", encoding="utf-8") as f:
    f.write(js_nuevo)
print("JS: efecto tilt 3D añadido al final de script.js.")

print("\\nBackups guardados: index.html.bak2, style.css.bak2, script.js.bak2")
