import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak8")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

viejo = '''<text font-size="15" fill="#1A1A1A" text-anchor="middle">
                                        <textPath href="#circlePath" startOffset="0%">✦</textPath>
                                    </text>
                                    <text font-size="15" fill="#1A1A1A" text-anchor="middle">
                                        <textPath href="#circlePath" startOffset="50%">✦</textPath>
                                    </text>'''

nuevo = '''<text font-size="22" fill="#1A1A1A" text-anchor="middle" dominant-baseline="middle">
                                        <textPath href="#circlePath" startOffset="0%">✦</textPath>
                                    </text>
                                    <text font-size="22" fill="#1A1A1A" text-anchor="middle" dominant-baseline="middle">
                                        <textPath href="#circlePath" startOffset="50%">✦</textPath>
                                    </text>'''

if viejo in html:
    html = html.replace(viejo, nuevo, 1)
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML: estrellas agrandadas (15 -> 22) y centradas exactamente en los lados del círculo (0% y 50%, es decir 9 y 3 en punto), entre las dos frases.")
else:
    print("AVISO: no encontré el bloque exacto de las estrellas. Puede que lo hayas tocado a mano — pásame el index.html actual si esto falla.")

print("\\nBackup guardado: index.html.bak8")
