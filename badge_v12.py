import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak15")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

cambios = 0

reemplazos = [
    # Bajar el desplazamiento del texto (8 -> 4, más cerca del punto medio)
    ('<tspan dy="8">SCROLL DOWN</tspan>', '<tspan dy="4">SCROLL DOWN</tspan>'),
    ('<tspan dy="8">CONTACTA CONMIGO</tspan>', '<tspan dy="4">CONTACTA CONMIGO</tspan>'),
    # Aplicar el mismo desplazamiento a las estrellas para que queden a la
    # misma altura que el texto (antes no tenían dy, por eso no coincidían)
    (
        '<textPath href="#circlePath" startOffset="6%">✦</textPath>',
        '<textPath href="#circlePath" startOffset="6%"><tspan dy="4">✦</tspan></textPath>'
    ),
    (
        '<textPath href="#circlePath" startOffset="49%">✦</textPath>',
        '<textPath href="#circlePath" startOffset="49%"><tspan dy="4">✦</tspan></textPath>'
    ),
]

for viejo, nuevo in reemplazos:
    if viejo in html:
        html = html.replace(viejo, nuevo, 1)
        cambios += 1
    else:
        print(f"AVISO: no encontré '{viejo[:60]}...' — revisa si el HTML ya no coincide.")

if cambios > 0:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML actualizado ({cambios} de 4 cambios aplicados).")
else:
    print("No se aplicó ningún cambio.")

print("\\nBackup guardado: index.html.bak15")
