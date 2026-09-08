import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak10")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

cambios = 0

# 1) Centrar verticalmente el texto de las frases entre los dos círculos
#    (dominant-baseline="middle" centra el glifo sobre el trazado, en vez
#    de apoyarlo por su base, que es lo que lo pegaba al círculo exterior)
reemplazos = [
    (
        '<text font-size="15" letter-spacing="2" fill="#1A1A1A" text-anchor="middle">\n                                        <textPath href="#circlePath" startOffset="28%">SCROLL DOWN</textPath>',
        '<text font-size="15" letter-spacing="2" fill="#1A1A1A" text-anchor="middle" dominant-baseline="middle">\n                                        <textPath href="#circlePath" startOffset="28%">SCROLL DOWN</textPath>'
    ),
    (
        '<text font-size="15" letter-spacing="2" fill="#1A1A1A" text-anchor="middle">\n                                        <textPath href="#circlePath" startOffset="78%">CONTACTA CONMIGO</textPath>',
        '<text font-size="15" letter-spacing="2" fill="#1A1A1A" text-anchor="middle" dominant-baseline="middle">\n                                        <textPath href="#circlePath" startOffset="78%">CONTACTA CONMIGO</textPath>'
    ),
    # 2) Estrellas: alejarlas de "CONTACTA CONMIGO" (que es más larga y las
    #    empujaba hacia ese lado) para que queden centradas en el hueco real
    ('startOffset="3%">✦', 'startOffset="6%">✦'),
    ('startOffset="53%">✦', 'startOffset="49%">✦'),
]

for viejo, nuevo in reemplazos:
    if viejo in html:
        html = html.replace(viejo, nuevo, 1)
        cambios += 1
    else:
        print(f"AVISO: no encontré un bloque esperado (puede que ya no coincida exactamente). Se omite ese cambio.")

if cambios > 0:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML actualizado ({cambios} de 4 cambios aplicados).")
else:
    print("No se aplicó ningún cambio. Pásame el index.html actual para ajustarlo sobre el HTML real.")

print("\\nBackup guardado: index.html.bak10")
