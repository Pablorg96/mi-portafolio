with open("index.html", "r", encoding="utf-8") as f:
    contenido = f.read()

viejo = '<img src="images/pablo-romero.jpg" alt="Pablo Romero">'
nuevo = '<img src="images/pablo-romero.png" alt="Pablo Romero">'

if viejo in contenido:
    contenido = contenido.replace(viejo, nuevo)
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(contenido)
    print("Listo: ruta de la foto actualizada a images/pablo-romero.png")
else:
    print("AVISO: no encontré la línea exacta de la imagen. Revisa el HTML manualmente.")
