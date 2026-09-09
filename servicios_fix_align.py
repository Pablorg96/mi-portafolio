import shutil

archivo_css = "style.css"
shutil.copy(archivo_css, archivo_css + ".bak25")

css_nuevo = '''

/* Servicios móvil: alinear título/subtítulo/texto en el mismo margen,
   y evitar que el cambio a pantalla completa se "anime" (causaba el
   efecto de texto agrandándose de golpe) */
@media (max-width: 768px) {
    .servicio-expand {
        padding: 0;
    }

    .servicio-row.mobile-active {
        transition: background-color 0.3s ease, color 0.3s ease;
    }
}
'''

with open(archivo_css, "a", encoding="utf-8") as f:
    f.write(css_nuevo)

print("CSS: párrafo alineado con el título/subtítulo, y transición de ancho eliminada en la fila activa.")
print("\\nBackup guardado: style.css.bak25")
