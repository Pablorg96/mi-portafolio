import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak14")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

cambios = 0

reemplazos = [
    ('<tspan dy="14">SCROLL DOWN</tspan>', '<tspan dy="8">SCROLL DOWN</tspan>'),
    ('<tspan dy="14">CONTACTA CONMIGO</tspan>', '<tspan dy="8">CONTACTA CONMIGO</tspan>'),
]

for viejo, nuevo in reemplazos:
    if viejo in html:
        html = html.replace(viejo, nuevo, 1)
        cambios += 1
    else:
        print("AVISO: no encontré uno de los bloques esperados (con dy=14).")

if cambios > 0:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML actualizado ({cambios} de 2 cambios aplicados): dy 14 -> 8.")
else:
    print("No se aplicó ningún cambio.")

print("\\nBackup guardado: index.html.bak14")
