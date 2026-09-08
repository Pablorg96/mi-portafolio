import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak11")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

cambios = 0

# Safari no respeta bien "dominant-baseline" sobre textPath, así que en vez
# de eso desplazamos el texto verticalmente con "dy" (sí soportado en Safari),
# empujándolo hacia el círculo interior para centrarlo en el hueco entre los dos aros.
reemplazos = [
    (
        '<textPath href="#circlePath" startOffset="28%">SCROLL DOWN</textPath>',
        '<textPath href="#circlePath" startOffset="28%" dy="6">SCROLL DOWN</textPath>'
    ),
    (
        '<textPath href="#circlePath" startOffset="78%">CONTACTA CONMIGO</textPath>',
        '<textPath href="#circlePath" startOffset="78%" dy="6">CONTACTA CONMIGO</textPath>'
    ),
]

for viejo, nuevo in reemplazos:
    if viejo in html:
        html = html.replace(viejo, nuevo, 1)
        cambios += 1
    else:
        print("AVISO: no encontré uno de los bloques esperados (puede que ya no coincida exactamente).")

if cambios > 0:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML actualizado ({cambios} de 2 cambios aplicados).")
else:
    print("No se aplicó ningún cambio. Pásame el index.html actual para ajustarlo sobre el HTML real.")

print("\\nBackup guardado: index.html.bak11")
