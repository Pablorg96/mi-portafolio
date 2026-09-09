import shutil

archivo_js = "script.js"
shutil.copy(archivo_js, archivo_js + ".bak24")

with open(archivo_js, "r", encoding="utf-8") as f:
    js = f.read()

viejo = '''// Servicios interactivos en móvil: tocar la fila expande texto + foto debajo
document.querySelectorAll('.servicio-row').forEach((row) => {
    row.addEventListener('click', () => {
        row.classList.toggle('mobile-active');
    });
});'''

nuevo = '''// Servicios interactivos en móvil: se abre la fila que tiene el dedo encima
// mientras te desplazas (sin necesidad de tocar aparte), y se cierra al pasar a la siguiente
(function () {
    const filas = document.querySelectorAll('.servicio-row');
    if (!filas.length) return;

    let filaActiva = null;

    function actualizarPorPosicion(touch) {
        if (!touch) return;
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const fila = el ? el.closest('.servicio-row') : null;

        if (fila !== filaActiva) {
            if (filaActiva) filaActiva.classList.remove('mobile-active');
            if (fila) fila.classList.add('mobile-active');
            filaActiva = fila;
        }
    }

    document.addEventListener('touchstart', (e) => {
        actualizarPorPosicion(e.touches[0]);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        actualizarPorPosicion(e.touches[0]);
    }, { passive: true });
})();'''

if viejo in js:
    js = js.replace(viejo, nuevo, 1)
    with open(archivo_js, "w", encoding="utf-8") as f:
        f.write(js)
    print("JS: sustituido el toggle por clic por la apertura al pasar el dedo (touchstart/touchmove).")
else:
    print("AVISO: no encontré el bloque exacto del toggle por clic. Puede que lo hayas tocado a mano — pásame el script.js actual si esto falla.")

print("\\nBackup guardado: script.js.bak24")
