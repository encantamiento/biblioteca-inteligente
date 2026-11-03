/* ==================================================
   BIBLIOTECA VIRTUAL — JS PRINCIPAL
================================================== */

/* -------- 0) OCULTAR LOADER (a prueba de errores) -------- */
(function ocultarLoader() {
    function hide() {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(hide, 800);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(hide, 800));
    }
    window.addEventListener('load', () => setTimeout(hide, 800));
    setTimeout(hide, 3000);
})();

/* -------- 1) ABRIR / CERRAR LIBRO -------- */
function abrirLibro(url, titulo, grado) {
    const modal = document.getElementById('bookModal');
    const iframe = document.getElementById('pdfViewer');
    if (!modal || !iframe) return;

    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalGrade').textContent = grado;

    let previewUrl = url;
    const driveMatch = url.match(/\/file\/d\/([^/]+)/);
    if (driveMatch) previewUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;

    iframe.src = previewUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarLibro() {
    const modal = document.getElementById('bookModal');
    const iframe = document.getElementById('pdfViewer');
    if (!modal) return;
    modal.classList.remove('active');
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
}

/* -------- 2) INICIALIZAR -------- */
document.addEventListener('DOMContentLoaded', () => {

    // ESC cierra el modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarLibro();
    });

    // Click fuera del modal
    const modal = document.getElementById('bookModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'bookModal') cerrarLibro();
        });
    }

    // Menú móvil
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // Buscador
    const buscador = document.getElementById('buscar');
    const noResults = document.getElementById('noResults');
    if (buscador && noResults) {
        buscador.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const gradeSections = document.querySelectorAll('.grade-section');
            let totalVisible = 0;

            gradeSections.forEach(section => {
                const cards = section.querySelectorAll('.book-card');
                let sectionVisible = 0;

                cards.forEach(card => {
                    const title = (card.dataset.title || '').toLowerCase();
                    const text = card.querySelector('h3')?.textContent.toLowerCase() || '';
                    const match = !query || title.includes(query) || text.includes(query);
                    card.style.display = match ? '' : 'none';
                    if (match) sectionVisible++;
                });

                section.style.display = sectionVisible > 0 ? '' : 'none';
                totalVisible += sectionVisible;
            });

            noResults.classList.toggle('show', totalVisible === 0 && query.length > 0);
        });
    }

    // Año dinámico
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});