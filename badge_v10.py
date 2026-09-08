import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak13")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

cambios = 0

reemplazos = [
    (
        '<textPath href="#circlePath" startOffset="28%" dy="10">SCROLL DOWN</textPath>',
        '<textPath href="#circlePath" startOffset="28%"><tspan dy="14">SCROLL DOWN</tspan></textPath>'
    ),
    (
        '<textPath href="#circlePath" startOffset="78%" dy="10">CONTACTA CONMIGO</textPath>',
        '<textPath href="#circlePath" startOffset="78%"><tspan dy="14">CONTACTA CONMIGO</tspan></textPath>'
    ),
]

for viejo, nuevo in reemplazos:
    if viejo in html:
        html = html.replace(viejo, nuevo, 1)
        cambios += 1
    else:
        print("AVISO: no encontré uno de los bloques esperados (con dy=10). Puede que el script v9 no llegara a aplicarse.")

if cambios > 0:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML actualizado ({cambios} de 2 cambios aplicados): ahora usa <tspan dy=\"14\"> en vez de dy en textPath.")
else:
    print("No se aplicó ningún cambio.")

print("\\nBackup guardado: index.html.bak13")
