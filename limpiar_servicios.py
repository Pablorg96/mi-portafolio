import re, shutil, sys

archivo = "index.html"
shutil.copy(archivo, archivo + ".bak")

with open(archivo, "r", encoding="utf-8") as f:
    contenido = f.read()

original = contenido

# Quitar bloque "Trabajos" (Servicios Principales)
contenido, n1 = re.subn(
    r'\n\s*<!-- Trabajos -->.*?</section>\n',
    '\n',
    contenido,
    count=1,
    flags=re.DOTALL
)

# Quitar bloque "Servicios" (Qué ofrezco)
contenido, n2 = re.subn(
    r'\n\s*<!-- Servicios -->.*?</section>\n',
    '\n',
    contenido,
    count=1,
    flags=re.DOTALL
)

# Vincular el id="servicios" a la sección interactiva nueva
contenido, n3 = re.subn(
    r'<section class="servicios-interactive">',
    '<section id="servicios" class="servicios-interactive">',
    contenido,
    count=1
)

if n1 == 0:
    print("AVISO: no se encontró el bloque 'Trabajos' — no se ha tocado.")
if n2 == 0:
    print("AVISO: no se encontró el bloque 'Servicios' — no se ha tocado.")
if n3 == 0:
    print("AVISO: no se encontró '<section class=\"servicios-interactive\">' — no se ha añadido el id.")

if contenido == original:
    print("Nada cambió. Revisa el archivo manualmente.")
    sys.exit(1)

with open(archivo, "w", encoding="utf-8") as f:
    f.write(contenido)

print(f"Listo. Bloques eliminados: Trabajos={n1}, Servicios={n2}. id añadido: {n3}.")
print("Backup guardado en index.html.bak")
