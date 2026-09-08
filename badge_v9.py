import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak12")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

cambios = 0

reemplazos = [
    (
        'startOffset="28%" dy="6">SCROLL DOWN',
        'startOffset="28%" dy="10">SCROLL DOWN'
    ),
    (
        'startOffset="78%" dy="6">CONTACTA CONMIGO',
        'startOffset="78%" dy="10">CONTACTA CONMIGO'
    ),
]

for viejo, nuevo in reemplazos:
    if viejo in html:
        html = html.replace(viejo, nuevo, 1)
        cambios += 1
    else:
        print("AVISO: no encontré uno de los bloques esperados.")

if cambios > 0:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML actualizado ({cambios} de 2 cambios aplicados): dy 6 -> 10.")
else:
    print("No se aplicó ningún cambio.")

print("\\nBackup guardado: index.html.bak12")
