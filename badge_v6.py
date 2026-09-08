import shutil

archivo_html = "index.html"

shutil.copy(archivo_html, archivo_html + ".bak9")

with open(archivo_html, "r", encoding="utf-8") as f:
    html = f.read()

cambios = 0

# 1) Ajustar posiciones (evitamos el 0% exacto, que en Safari rompe el centrado
#    de textPath y hace que el carácter "flote" en el centro en vez de sobre el aro)
reemplazos = [
    ('startOffset="25%">SCROLL DOWN', 'startOffset="28%">SCROLL DOWN'),
    ('startOffset="75%">CONTACTA CONMIGO', 'startOffset="78%">CONTACTA CONMIGO'),
    ('startOffset="0%">✦', 'startOffset="3%">✦'),
    ('startOffset="50%">✦', 'startOffset="53%">✦'),
]

for viejo, nuevo in reemplazos:
    if viejo in html:
        html = html.replace(viejo, nuevo, 1)
        cambios += 1
    else:
        print(f"AVISO: no encontré '{viejo}' — no se tocó esa parte.")

# 2) Flecha más grande
viejo_flecha = '<svg class="badge-arrow" viewBox="0 0 24 24" width="22" height="22" fill="none">'
nueva_flecha = '<svg class="badge-arrow" viewBox="0 0 24 24" width="36" height="36" fill="none">'

if viejo_flecha in html:
    html = html.replace(viejo_flecha, nueva_flecha, 1)
    cambios += 1
    print("Flecha agrandada (22px -> 36px).")
else:
    print("AVISO: no encontré el <svg> de la flecha con ese tamaño exacto.")

if cambios > 0:
    with open(archivo_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML actualizado ({cambios} cambios aplicados).")
else:
    print("No se aplicó ningún cambio. Pásame el index.html actual para ajustarlo sobre el HTML real.")

print("\\nBackup guardado: index.html.bak9")
