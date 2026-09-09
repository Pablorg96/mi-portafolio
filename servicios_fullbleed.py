import shutil

archivo_css = "style.css"
shutil.copy(archivo_css, archivo_css + ".bak23")

css_nuevo = '''

/* Servicios móvil: el fondo negro llega hasta los bordes reales de la pantalla */
@media (max-width: 768px) {
    .servicio-row.mobile-active {
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 0;
    }
}
'''

with open(archivo_css, "a", encoding="utf-8") as f:
    f.write(css_nuevo)

print("CSS: la fila activa ahora se extiende a pantalla completa en móvil (full-bleed), con 20px de margen interno para el texto.")
print("\\nBackup guardado: style.css.bak23")
