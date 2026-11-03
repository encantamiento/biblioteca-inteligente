/* ==================================================
   FLYERS — Render dinámico en el sitio principal
================================================== */

function renderFlyers(flyers) {
  const container = document.getElementById('flyersGrid');
  if (!container) return;
  const list = flyers || (window.contentData && window.contentData.flyers) || [];
  if (!list.length) return;

  container.innerHTML = list.map((f, i) => `
    <article class="flyer-card reveal-scale" data-index="${i}">
      <div class="flyer-img-wrap">
        <img src="${f.image}" alt="${f.title}" loading="lazy" onerror="this.parentElement.classList.add('broken')">
        <div class="flyer-overlay">
          <span class="flyer-cat">${f.category || ''}</span>
          <h3>${f.title || ''}</h3>
          <p>${f.description || ''}</p>
        </div>
      </div>
    </article>
  `).join('');

  // Abrir en lightbox al hacer clic
  container.querySelectorAll('.flyer-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index);
      if (typeof openLightbox === 'function') {
        openLightbox(idx, list.map(f => ({ src: f.image, alt: f.title })));
      }
    });
  });

  // Re-observar para animaciones
  if (typeof IntersectionObserver !== 'undefined') {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    container.querySelectorAll('.reveal-scale').forEach(el => obs.observe(el));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const flyers = (window.contentData && window.contentData.flyers) || [];
  renderFlyers(flyers);
});