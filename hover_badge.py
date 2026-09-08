import shutil

archivo_html = "index.html"
archivo_css = "style.css"

shutil.copy(archivo_html, archivo_html + ".bak4")
shutil.copy(archivo_css, archivo_css + ".bak4")

# ---------- 1) HTML: insertar el overlay + badge dentro de .about-photo-card ----------
with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

viejo = '<img src="images/pablo-romero.png" alt="Pablo Romero">'

overlay = '''<img src="images/pablo-romero.png" alt="Pablo Romero">
                        <div class="about-photo-overlay">
                            <div class="about-photo-badge">
                                <svg class="badge-rotate" viewBox="0 0 200 200" width="150" height="150">
                                    <defs>
                                        <path id="circlePath" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                                    </defs>
                                    <text font-size="11" letter-spacing="3" fill="#1A1A1A">
                                        <textPath href="#circlePath" startOffset="0%">SCROLL DOWN ✦ AND KNOW ME BETTER ✦ </textPath>
                                    </text>
                                </svg>
                                <svg class="badge-arrow" viewBox="0 0 24 24" width="22" height="22" fill="none">
                                    <path d="M12 4v13M6 12l6 6 6-6" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>'''

if viejo in html:
    html = html.replace(viejo, overlay, 1)
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML: overlay + badge circular insertados en la tarjeta de la foto.")
else:
    print("AVISO: no encontré la línea exacta de la <img>. Revisa el HTML manualmente.")

# ---------- 2) CSS ----------
css_nuevo = '''

/* About - Overlay glassmorphism + badge circular al hacer hover */
.about-photo-card {
    position: relative;
}

.about-photo-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    background-color: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: opacity 0.4s ease;
    pointer-events: none;
}

.about-photo-card:hover .about-photo-overlay {
    opacity: 1;
}

.about-photo-badge {
    position: relative;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-rotate {
    position: absolute;
    top: 0;
    left: 0;
    animation: badgeRotate 10s linear infinite;
}

@keyframes badgeRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.badge-arrow {
    position: relative;
    z-index: 2;
}
'''

with open(archivo_css, "a", encoding="utf-8") as f:
    f.write(css_nuevo)
print("CSS: estilos del overlay + badge añadidos al final de style.css.")

print("\\nBackups guardados: index.html.bak4, style.css.bak4")
