/* ==================================================
   ADMIN — Panel de administración
   Permite actualizar contenido sin tocar el código.
   Los cambios se guardan en localStorage.
================================================== */
/* ==================================================
   ADMIN — Núcleo compartido (main site + panel)
================================================== */

const ADMIN_KEY = 'jpc_admin_data';
const ADMIN_PASSWORD_KEY = 'jpc_admin_pass';
const ADMIN_SESSION_KEY = 'jpc_admin_session';
const DEFAULT_PASSWORD = 'jpc2026';   // ← cámbiala desde el panel

/* ---------- Persistencia ---------- */
function getAdminData() {
  try { return JSON.parse(localStorage.getItem(ADMIN_KEY)) || {}; }
  catch { return {}; }
}

function saveAdminData(data) {
  try {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error guardando:', e);
    alert('⚠️ No se pudo guardar. Las imágenes son muy grandes (máx. 5MB total). Usa rutas de imagen en vez de subir archivos.');
    return false;
  }
}

function clearAdminData() {
  localStorage.removeItem(ADMIN_KEY);
  location.reload();
}

/* ---------- Contraseña ---------- */
function getAdminPassword() {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
}
function setAdminPassword(newPass) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
}
function checkPassword(pass) {
  return pass === getAdminPassword();
}
function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}
function setAdminAuthenticated() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
}
function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

/* ---------- Merge datos ---------- */
function getMergedData() {
  const saved = getAdminData();
  const defaults = window.contentData || {};
  // merge profundo (2 niveles)
  const merged = { ...defaults };
  for (const key in saved) {
    if (saved[key] && typeof saved[key] === 'object' && !Array.isArray(saved[key])) {
      merged[key] = { ...(defaults[key] || {}), ...saved[key] };
    } else {
      merged[key] = saved[key];
    }
  }
  return merged;
}

/* ==================================================
   APLICAR CONTENIDO GUARDADO AL SITIO PRINCIPAL
================================================== */
function applySavedContent() {
  const saved = getAdminData();
  if (!saved || Object.keys(saved).length === 0) return;

  const data = getMergedData();

  applySchoolInfo(data.school);
  applyHero(data.hero);
  applyPresentation(data.presentation);
  applyHistory(data.history);
  applyGallery(data.gallery);
  applyFlyers(data.flyers);
  applyContact(data.contact);
}

/* --- Info general --- */
function applySchoolInfo(school) {
  if (!school) return;
  const setText = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.textContent = val; };
  setText('[data-field="schoolName"]', school.name);
  setText('[data-field="schoolLocation"]', school.location);
  setText('[data-field="schoolMotto"]', school.motto);

  if (school.yearsOfActivity) {
    const counter = document.getElementById('yearsCounter');
    if (counter) counter.textContent = school.yearsOfActivity;
    const badge = document.querySelector('.hero-badge span');
    if (badge) badge.textContent = `${school.yearsOfActivity} AÑOS DE EXCELENCIA EDUCATIVA`;
  }
  if (school.founded) {
    const logoCircle = document.querySelector('.footer-logo .logo-circle');
    if (logoCircle) logoCircle.textContent = school.founded;
  }
}

/* --- Hero --- */
function applyHero(hero) {
  if (!hero) return;

  if (hero.image) {
    const heroImg = document.querySelector('.hero-bg-image');
    if (heroImg) heroImg.src = hero.image;
  }
  if (hero.title) {
    const titleSpan = document.querySelector('.hero h1 .gold-text');
    if (titleSpan) titleSpan.textContent = hero.title;
  }
  if (hero.subtitle) {
    const sub = document.querySelector('.hero p.animate-slide-up');
    if (sub) {
      // preservar el HTML interno si existe
      sub.innerHTML = hero.subtitle;
    }
  }
  if (Array.isArray(hero.stats) && hero.stats.length) {
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
      statsContainer.innerHTML = hero.stats.map(s => `
        <div class="stat">
          <span class="stat-number" data-target="${s.value}">0</span>
          <span class="stat-label">${s.label}</span>
        </div>
      `).join('');
      // reanimar contadores
      if (typeof animateCounter === 'function') {
        statsContainer.querySelectorAll('.stat-number').forEach(el => {
          const target = parseInt(el.dataset.target) || 0;
          animateCounter(el, 0, target, 1800, target === 100 ? '%' : (target >= 1000 ? '+' : ''));
        });
      }
    }
  }
}

/* --- Presentación --- */
function applyPresentation(pres) {
  if (!pres) return;
  const cards = document.querySelectorAll('.pres-mission .mission-card p');
  if (cards[0] && pres.mission) cards[0].textContent = pres.mission;
  if (cards[1] && pres.vision) cards[1].textContent = pres.vision;
}

/* --- Historia --- */
function applyHistory(history) {
  if (!Array.isArray(history) || !history.length) return;
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const line = timeline.querySelector('.timeline-line');
  timeline.innerHTML = '';
  if (line) timeline.appendChild(line);

  history.forEach((h, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const item = document.createElement('div');
    item.className = `timeline-item ${side} reveal-${side === 'left' ? 'left' : 'right'} visible`;
    item.innerHTML = `
      <div class="timeline-dot"><i class="fas fa-flag"></i></div>
      <div class="timeline-card glass-card">
        <span class="timeline-year">${h.year}</span>
        <h3>${h.title}</h3>
        <p>${h.text}</p>
      </div>
    `;
    timeline.appendChild(item);
  });
}

/* --- Galería --- */
function applyGallery(gallery) {
  if (!Array.isArray(gallery)) return;
  if (window.contentData) window.contentData.gallery = gallery;
  if (typeof renderGallery === 'function') {
    const activeFilter = document.querySelector('.filter-btn.active');
    const filter = activeFilter ? activeFilter.dataset.filter : 'all';
    renderGallery(filter);
  }
}

/* --- Flyers (NUEVO) --- */
function applyFlyers(flyers) {
  if (!Array.isArray(flyers)) return;
  if (window.contentData) window.contentData.flyers = flyers;
  if (typeof renderFlyers === 'function') renderFlyers(flyers);
}

/* --- Contacto --- */
function applyContact(contact) {
  if (!contact) return;
  const items = document.querySelectorAll('.contact-info-grid .contact-item p');
  if (items[0] && contact.address) items[0].textContent = contact.address;
  if (items[1] && contact.phone)   items[1].textContent = contact.phone;
  if (items[2] && contact.email)   items[2].textContent = contact.email;
  if (items[3] && contact.hours)   items[3].textContent = contact.hours;
  if (contact.facebook) {
    document.querySelectorAll('a[href*="facebook.com"]').forEach(a => {
      if (a.classList.contains('social-btn') || a.closest('.footer-social')) a.href = contact.facebook;
    });
  }
}

/* ---------- Ejecutar ---------- */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(applySavedContent, 100);
});

/* ==================================================
   BOTÓN DE ACCESO AL PANEL ADMIN (robusto)
================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const adminToggle = document.getElementById('adminToggle');
  if (!adminToggle) return;

  // Si ya estás en /admin/, oculta el botón
  if (/\/admin\//.test(window.location.pathname)) {
    adminToggle.style.display = 'none';
    return;
  }

  adminToggle.addEventListener('click', () => {
    // Construye la ruta absoluta a la carpeta admin
    const base = window.location.pathname
      .replace(/\/[^/]*$/, '')   // quita el archivo actual
      .replace(/\/$/, '');        // quita la barra final
    window.location.href = `${base}/admin/index.html`;
  });
});

/* Exponer globalmente */
window.getAdminData = getAdminData;
window.saveAdminData = saveAdminData;
window.clearAdminData = clearAdminData;
window.getMergedData = getMergedData;
window.applySavedContent = applySavedContent;
window.checkPassword = checkPassword;
window.isAdminAuthenticated = isAdminAuthenticated;
window.setAdminAuthenticated = setAdminAuthenticated;
window.logoutAdmin = logoutAdmin;
window.setAdminPassword = setAdminPassword;
window.getAdminPassword = getAdminPassword;