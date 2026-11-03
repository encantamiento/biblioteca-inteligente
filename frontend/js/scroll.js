/* ==================================================
   SCROLL — Sombra del header y botón "volver arriba"
================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const header   = document.getElementById('header');      // ← era #mainHeader
    const backTop  = document.getElementById('backTop');      // ← era #backToTop

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (header)  header.classList.toggle('scrolled', y > 50);
        if (backTop) backTop.classList.toggle('show', y > 600);   // ← CSS usa .show
    });

    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});