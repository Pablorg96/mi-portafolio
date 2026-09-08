import shutil

archivo_html = "index.html"
archivo_css = "style.css"

shutil.copy(archivo_html, archivo_html + ".bak6")
shutil.copy(archivo_css, archivo_css + ".bak6")

# ---------- 1) HTML: texto más grande + círculo extra junto a la flecha ----------
with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

viejo = '''<circle cx="100" cy="100" r="95" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <text font-size="11" letter-spacing="3" fill="#1A1A1A">
                                        <textPath href="#circlePath" startOffset="0%">SCROLL DOWN ✦ CONTACTA CONMIGO ✦ </textPath>
                                    </text>'''

nuevo = '''<circle cx="100" cy="100" r="95" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <circle cx="100" cy="100" r="38" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <text font-size="15" letter-spacing="3" fill="#1A1A1A">
                                        <textPath href="#circlePath" startOffset="0%">SCROLL DOWN ✦ CONTACTA CONMIGO ✦ </textPath>
                                    </text>'''

if viejo in html:
    html = html.replace(viejo, nuevo, 1)
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML: texto más grande y círculo extra alrededor de la flecha añadidos.")
else:
    print("AVISO: no encontré el bloque exacto del SVG. Puede que lo hayas tocado a mano — pásame el HTML actual si esto falla.")

# ---------- 2) CSS: animación de flotar en la flecha ----------
css_nuevo = '''

/* About - Flecha flotando (v3) */
.badge-arrow {
    animation: floatArrow 2s ease-in-out infinite alternate;
}

@keyframes floatArrow {
    from { transform: translateY(-4px); }
    to { transform: translateY(4px); }
}
'''

with open(archivo_css, "a", encoding="utf-8") as f:
    f.write(css_nuevo)
print("CSS: animación de flotar añadida a la flecha.")

print("\\nBackups guardados: index.html.bak6, style.css.bak6")
