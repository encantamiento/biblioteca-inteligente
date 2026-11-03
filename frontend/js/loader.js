/* ==================================================
   PANTALLA DE CARGA
================================================== */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Activar animaciones del hero después de cargar
            document.body.classList.add('loaded');
        }, 1800);
    }
});