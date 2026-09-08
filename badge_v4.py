import shutil

archivo_html = "index.html"
archivo_css = "style.css"

shutil.copy(archivo_html, archivo_html + ".bak7")
shutil.copy(archivo_css, archivo_css + ".bak7")

# ---------- 1) HTML: círculo interior más grande/separado + texto repartido en 2 lados con ✦ ----------
with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

viejo = '''<circle cx="100" cy="100" r="95" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <circle cx="100" cy="100" r="38" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <text font-size="15" letter-spacing="3" fill="#1A1A1A">
                                        <textPath href="#circlePath" startOffset="0%">SCROLL DOWN ✦ CONTACTA CONMIGO ✦ </textPath>
                                    </text>'''

nuevo = '''<circle cx="100" cy="100" r="95" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <circle cx="100" cy="100" r="58" fill="none" stroke="#1A1A1A" stroke-width="1"/>
                                    <text font-size="15" letter-spacing="2" fill="#1A1A1A" text-anchor="middle">
                                        <textPath href="#circlePath" startOffset="25%">SCROLL DOWN</textPath>
                                    </text>
                                    <text font-size="15" letter-spacing="2" fill="#1A1A1A" text-anchor="middle">
                                        <textPath href="#circlePath" startOffset="75%">CONTACTA CONMIGO</textPath>
                                    </text>
                                    <text font-size="15" fill="#1A1A1A" text-anchor="middle">
                                        <textPath href="#circlePath" startOffset="0%">✦</textPath>
                                    </text>
                                    <text font-size="15" fill="#1A1A1A" text-anchor="middle">
                                        <textPath href="#circlePath" startOffset="50%">✦</textPath>
                                    </text>'''

if viejo in html:
    html = html.replace(viejo, nuevo, 1)
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML: círculo interior agrandado/separado y texto repartido en 2 lados opuestos con las ✦ entre medias.")
else:
    print("AVISO: no encontré el bloque exacto del SVG (¿lo tocaste a mano?). Pásame el index.html actual si esto falla.")

# ---------- 2) CSS: tipografía bold del Hero en vez de la serif ----------
with open(archivo_css, "r", encoding="utf-8") as f:
    css = f.read()

viejo_css = '''.about-photo-badge text {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 600;
}'''

nuevo_css = '''.about-photo-badge text {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
    font-weight: 700;
}'''

if viejo_css in css:
    css = css.replace(viejo_css, nuevo_css, 1)
    with open(archivo_css, "w", encoding="utf-8") as f:
        f.write(css)
    print("CSS: tipografía del badge cambiada a la misma bold sans-serif del Hero.")
else:
    print("AVISO: no encontré la regla CSS exacta del badge. Revisa manualmente.")

print("\\nBackups guardados: index.html.bak7, style.css.bak7")
