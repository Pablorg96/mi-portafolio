import shutil

archivo_html = "index.html"
archivo_css = "style.css"

shutil.copy(archivo_html, archivo_html + ".bak5")
shutil.copy(archivo_css, archivo_css + ".bak5")

# ---------- 1) HTML: añadir el círculo visible + cambiar el texto ----------
with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

viejo_svg = '''<svg class="badge-rotate" viewBox="0 0 200 200" width="150" height="150">
                                    <defs>
                                        <path id="circlePath" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                                    </defs>
                                    <text font-size="11" letter-spacing="3" fill="#1A1A1A">
                                        <textPath href="#circlePath" startOffset="0%">SCROLL DOWN ✦ AND KNOW ME BETTER ✦ </textPath>
                                    </text>
                                </svg>'''

nuevo_svg = '''<svg class="badge-rotate" viewBox="0 0 200 200" width="150" height="150">
                                    <defs>
                                        <path id="circlePath" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                                    </defs>
                                    <circle cx="100" cy="100" r="95" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <text font-size="11" letter-spacing="3" fill="#1A1A1A">
                                        <textPath href="#circlePath" startOffset="0%">SCROLL DOWN ✦ CONTACTA CONMIGO ✦ </textPath>
                                    </text>
                                </svg>'''

if viejo_svg in html:
    html = html.replace(viejo_svg, nuevo_svg, 1)
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML: círculo añadido y frase cambiada a 'CONTACTA CONMIGO'.")
else:
    print("AVISO: no encontré el bloque exacto del SVG. Revisa el HTML manualmente (puede que ya lo hayas tocado a mano).")

# ---------- 2) CSS: tipografía más elegante para el badge ----------
css_nuevo = '''

/* About - Ajustes del badge circular (v2) */
.about-photo-badge text {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 600;
}
'''

with open(archivo_css, "a", encoding="utf-8") as f:
    f.write(css_nuevo)
print("CSS: tipografía serif aplicada al texto del badge.")

print("\\nBackups guardados: index.html.bak5, style.css.bak5")
