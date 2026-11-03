/* ==================================================
   PARTÍCULAS DE FONDO
================================================== */

function createParticles() {
    const containers = document.querySelectorAll('.particles-bg');
    containers.forEach(container => {
        const count = parseInt(container.getAttribute('data-count')) || 25;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 6 + 2;
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: floatParticle ${Math.random() * 8 + 5}s ease-in-out ${Math.random() * 3}s infinite;
            `;
            container.appendChild(particle);
        }
    });
}

// Crear partículas al cargar
document.addEventListener('DOMContentLoaded', createParticles);