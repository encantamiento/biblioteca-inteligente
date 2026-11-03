/* ==================================================
   GALERÍA DINÁMICA — v2 (con datos del admin)
================================================== */

const galleryGrid = document.getElementById('galleryGrid');

function renderGallery(filter = 'all') {
    if (!galleryGrid) return;

    // Leer datos fusionados (default + admin)
    const data = (typeof getMergedData === 'function')
        ? getMergedData()
        : (window.contentData || {});

    const images = data.gallery || [];
    galleryGrid.innerHTML = '';

    const filtered = filter === 'all'
        ? images
        : images.filter(img => img.category === filter);

    if (filtered.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:#94a3b8;">
                <i class="fas fa-image" style="font-size:40px;margin-bottom:10px;display:block;opacity:.4;"></i>
                No hay imágenes en esta categoría.
            </div>`;
        return;
    }

    filtered.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = `gallery-item ${img.category}`;
        item.setAttribute('data-index', i);
        item.innerHTML = `
            <img src="${img.src}" alt="${img.alt}" loading="lazy"
                 onerror="this.parentElement.classList.add('img-error');this.remove();">
            <div class="overlay">
                <i class="fas fa-search-plus zoom-icon"></i>
                <span class="caption">${img.alt}</span>
            </div>
        `;
        item.addEventListener('click', () => {
            if (typeof openLightbox === 'function') openLightbox(i, filtered);
        });
        galleryGrid.appendChild(item);
    });
}

/* Filtros */
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.getAttribute('data-filter'));
    });
});

/* Render inicial cuando el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
    renderGallery('all');
});