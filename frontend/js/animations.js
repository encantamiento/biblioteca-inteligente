/* ==================================================
   ANIMACIONES DE SCROLL (Intersection Observer)
================================================== */

// Observador para elementos con reveal
const revealElements = document.querySelectorAll(
    '.reveal-text, .reveal-left, .reveal-right, .reveal-up, .reveal-scale'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Animación escalonada para tarjetas y elementos de grid
const staggerElements = document.querySelectorAll(
    '.level-card, .infra-card, .activity-card, .gallery-item, .timeline-card, .mission-card'
);

const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = parent.querySelectorAll(
                '.level-card, .infra-card, .activity-card, .gallery-item, .timeline-card, .mission-card'
            );
            const index = Array.from(siblings).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            staggerObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

staggerElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    staggerObserver.observe(el);
});

// Efecto parallax suave en el hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        const heroImg = hero.querySelector('.hero-bg-image');
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
        }
    }
});