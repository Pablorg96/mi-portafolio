import shutil

archivo_html = "index.html"
archivo_css = "style.css"
archivo_js = "script.js"

shutil.copy(archivo_html, archivo_html + ".bak3")
shutil.copy(archivo_css, archivo_css + ".bak3")
shutil.copy(archivo_js, archivo_js + ".bak3")

# ---------- 1) HTML: quitar "reveal-blur" de la tarjeta de la foto ----------
with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

viejo = '<div class="about-photo-tilt reveal-blur">'
nuevo = '<div class="about-photo-tilt">'

if viejo in html:
    html = html.replace(viejo, nuevo)
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML: quitada la clase 'reveal-blur' de la tarjeta de la foto.")
else:
    print("AVISO: no encontré 'class=\"about-photo-tilt reveal-blur\"' en el HTML. Revisa manualmente.")

# ---------- 2) CSS: añadir el scroll reveal 3D ----------
css_nuevo = '''

/* Scroll Reveal 3D - Tarjeta de la foto */
.about-photo-tilt {
    opacity: 0;
    transform: perspective(1000px) translateY(80px) rotateX(15deg) rotateY(-10deg);
    transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.about-photo-tilt.visible {
    opacity: 1;
    transform: perspective(1000px) translateY(0) rotateX(0) rotateY(0);
}
'''

with open(archivo_css, "a", encoding="utf-8") as f:
    f.write(css_nuevo)
print("CSS: scroll reveal 3D añadido al final de style.css.")

# ---------- 3) JS: IntersectionObserver ----------
js_nuevo = '''

// Scroll Reveal 3D - IntersectionObserver (tarjeta de la foto en About)
document.addEventListener('DOMContentLoaded', () => {
    const tarjeta = document.querySelector('.about-photo-tilt');
    if (!tarjeta) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    observer.observe(tarjeta);
});
'''

with open(archivo_js, "a", encoding="utf-8") as f:
    f.write(js_nuevo)
print("JS: IntersectionObserver añadido al final de script.js.")

print("\\nBackups guardados: index.html.bak3, style.css.bak3, script.js.bak3")
