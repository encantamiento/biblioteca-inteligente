/* ==================================================
   LIGHTBOX
================================================== */

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentLightboxImages = [];
let currentLightboxIndex = 0;

function openLightbox(index, images) {
    currentLightboxImages = images;
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const img = currentLightboxImages[currentLightboxIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
}

function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightbox();
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightbox();
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

// Cerrar al hacer clic fuera de la imagen
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// Soporte de teclado
document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
});