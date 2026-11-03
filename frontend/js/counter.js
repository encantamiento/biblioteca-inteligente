/* ==================================================
   CONTADORES ANIMADOS
================================================== */

// Contador del badge de años en presentación
function animateCounter(element, start, end, duration, suffix = '') {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(eased * (end - start) + start);
        element.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// Observar cuando el badge de años sea visible
const yearsCounter = document.getElementById('yearsCounter');
if (yearsCounter) {
    const yearsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(yearsCounter, 0, 103, 2000);
                yearsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    yearsObserver.observe(yearsCounter);
}

// Contadores del hero
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
statNumbers.forEach(stat => {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(stat.getAttribute('data-target'));
                const suffix = target === 100 ? '%' : (target >= 1000 ? '+' : '');
                animateCounter(stat, 0, target, 2000, suffix);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statObserver.observe(stat);
});