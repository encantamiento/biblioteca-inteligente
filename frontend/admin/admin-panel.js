/* ==================================================
   ADMIN PANEL — Login + Formularios + Flyers
================================================== */

/* ---------- Referencias ---------- */
const loginScreen = document.getElementById('loginScreen');
const adminApp    = document.getElementById('adminApp');
const loginForm   = document.getElementById('loginForm');
const loginPass   = document.getElementById('loginPassword');
const loginError  = document.getElementById('loginError');
const btnLogout   = document.getElementById('btnLogout');
const btnSave     = document.getElementById('btnSave');
const btnReset    = document.getElementById('btnReset');
const btnChangePass = document.getElementById('btnChangePass');

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.admin-section');

const addStatBtn     = document.getElementById('addStat');
const addTimelineBtn = document.getElementById('addTimeline');
const addGalleryBtn  = document.getElementById('addGallery');
const addFlyerBtn    = document.getElementById('addFlyer');

/* ==================================================
   LOGIN
================================================== */
function showApp() {
  loginScreen.style.display = 'none';
  adminApp.style.display = 'flex';
  loadFormData();
}
function showLogin() {
  loginScreen.style.display = 'flex';
  adminApp.style.display = 'none';
}

if (isAdminAuthenticated()) showApp(); else showLogin();

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const pass = loginPass.value.trim();
  if (checkPassword(pass)) {
    setAdminAuthenticated();
    loginError.textContent = '';
    loginPass.value = '';
    showApp();
    showToast('✅ Bienvenido al panel');
  } else {
    loginError.textContent = '❌ Contraseña incorrecta';
    loginPass.value = '';
  }
});

btnLogout.addEventListener('click', () => {
  logoutAdmin();
  showLogin();
});

btnChangePass.addEventListener('click', () => {
  const current = prompt('Contraseña actual:');
  if (!checkPassword(current)) return alert('Contraseña actual incorrecta');
  const nueva = prompt('Nueva contraseña (mín. 4 caracteres):');
  if (!nueva || nueva.length < 4) return alert('Contraseña inválida');
  setAdminPassword(nueva);
  alert('✅ Contraseña actualizada');
});

/* ==================================================
   NAVEGACIÓN LATERAL
================================================== */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    link.classList.add('active');
    const target = document.getElementById(link.dataset.section);
    if (target) target.classList.add('active');
  });
});

/* ==================================================
   UTILIDADES IMAGEN → BASE64
================================================== */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleImageUpload(inputEl, targetInputEl, previewEl) {
  const file = inputEl.files[0];
  if (!file) return;
  if (file.size > 800 * 1024) {
    if (!confirm('⚠️ La imagen pesa más de 800KB. Se recomienda usar ruta de archivo en vez de subirla. ¿Continuar?')) return;
  }
  const b64 = await fileToBase64(file);
  targetInputEl.value = b64;
  if (previewEl) {
    previewEl.src = b64;
    previewEl.style.display = 'block';
  }
}

/* ==================================================
   CARGAR DATOS
================================================== */
function loadFormData() {
  const data = getMergedData();
  const school = data.school || {};

  document.getElementById('schoolName').value      = school.name || '';
  document.getElementById('schoolLocation').value  = school.location || '';
  document.getElementById('foundedYear').value     = school.founded || '';
  document.getElementById('currentYear').value     = school.currentYear || '';
  document.getElementById('yearsActivity').value   = school.yearsOfActivity || '';
  document.getElementById('schoolMotto').value     = school.motto || '';

  const hero = data.hero || {};
  document.getElementById('heroImage').value    = hero.image || '';
  document.getElementById('heroTitle').value    = hero.title || '';
  document.getElementById('heroSubtitle').value = hero.subtitle || '';

  const heroPreview = document.getElementById('heroImagePreview');
  if (heroPreview && hero.image) { heroPreview.src = hero.image; heroPreview.style.display = 'block'; }

  const statsContainer = document.getElementById('statsContainer');
  statsContainer.innerHTML = '';
  (hero.stats || []).forEach(s => addStatRow(s));

  const pres = data.presentation || {};
  document.getElementById('mission').value = pres.mission || '';
  document.getElementById('vision').value  = pres.vision || '';

  const timelineContainer = document.getElementById('timelineContainer');
  timelineContainer.innerHTML = '';
  (data.history || []).forEach(h => addTimelineRow(h));

  const galleryContainer = document.getElementById('galleryContainer');
  galleryContainer.innerHTML = '';
  (data.gallery || []).forEach(g => addGalleryRow(g));

  const flyersContainer = document.getElementById('flyersContainer');
  flyersContainer.innerHTML = '';
  (data.flyers || []).forEach(f => addFlyerRow(f));

  const contact = data.contact || {};
  document.getElementById('contactAddress').value  = contact.address || '';
  document.getElementById('contactPhone').value    = contact.phone || '';
  document.getElementById('contactEmail').value    = contact.email || '';
  document.getElementById('contactHours').value    = contact.hours || '';
  document.getElementById('contactFacebook').value = contact.facebook || '';
}

/* ==================================================
   FILAS DINÁMICAS
================================================== */
function addStatRow(data = {}) {
  const c = document.getElementById('statsContainer');
  const row = document.createElement('div');
  row.className = 'stat-row';
  row.innerHTML = `
    <input type="text" class="stat-label" placeholder="Etiqueta" value="${data.label || ''}">
    <input type="number" class="stat-value" placeholder="Valor" value="${data.value || ''}">
    <input type="text" class="stat-suffix" placeholder="% / +" value="${data.suffix || ''}" style="max-width:80px">
    <button class="btn-remove" type="button"><i class="fas fa-trash"></i></button>
  `;
  row.querySelector('.btn-remove').addEventListener('click', () => row.remove());
  c.appendChild(row);
}

function addTimelineRow(data = {}) {
  const c = document.getElementById('timelineContainer');
  const row = document.createElement('div');
  row.className = 'timeline-row';
  row.innerHTML = `
    <input type="number" class="tl-year" placeholder="Año" value="${data.year || ''}" style="max-width:100px">
    <input type="text" class="tl-title" placeholder="Título" value="${data.title || ''}" style="max-width:200px">
    <input type="text" class="tl-text" placeholder="Descripción" value="${data.text || ''}">
    <button class="btn-remove" type="button"><i class="fas fa-trash"></i></button>
  `;
  row.querySelector('.btn-remove').addEventListener('click', () => row.remove());
  c.appendChild(row);
}

function addGalleryRow(data = {}) {
  const c = document.getElementById('galleryContainer');
  const row = document.createElement('div');
  row.className = 'gallery-row';
  row.innerHTML = `
    <input type="text" class="gal-src" placeholder="Ruta (img/galeria/foto.jpg)" value="${data.src || ''}">
    <input type="text" class="gal-alt" placeholder="Descripción" value="${data.alt || ''}" style="max-width:200px">
    <select class="gal-cat">
      <option value="infraestructura" ${data.category === 'infraestructura' ? 'selected' : ''}>Infraestructura</option>
      <option value="actividades"     ${data.category === 'actividades' ? 'selected' : ''}>Actividades</option>
    </select>
    <button class="btn-remove" type="button"><i class="fas fa-trash"></i></button>
  `;
  row.querySelector('.btn-remove').addEventListener('click', () => row.remove());
  c.appendChild(row);
}

/* ---------- NUEVO: Flyers ---------- */
function addFlyerRow(data = {}) {
  const c = document.getElementById('flyersContainer');
  const row = document.createElement('div');
  row.className = 'flyer-row';
  const uid = 'flyer-' + Math.random().toString(36).slice(2, 8);
  row.innerHTML = `
    <div class="flyer-preview-wrap">
      <img class="flyer-preview" id="prev-${uid}" src="${data.image || ''}" alt="" style="display:${data.image ? 'block' : 'none'}">
      <input type="file" accept="image/*" class="flyer-file" id="file-${uid}" hidden>
      <label for="file-${uid}" class="btn-upload"><i class="fas fa-upload"></i> Subir</label>
    </div>
    <input type="text" class="flyer-image" placeholder="O ruta: img/flyers/aniversario.webp" value="${data.image && !data.image.startsWith('data:') ? data.image : ''}">
    <input type="text" class="flyer-title" placeholder="Título" value="${data.title || ''}" style="max-width:220px">
    <input type="text" class="flyer-desc"  placeholder="Descripción corta" value="${data.description || ''}">
    <select class="flyer-cat">
      <option value="aniversario" ${data.category === 'aniversario' ? 'selected' : ''}>Aniversario</option>
      <option value="matricula"   ${data.category === 'matricula'   ? 'selected' : ''}>Matrícula</option>
      <option value="evento"      ${data.category === 'evento'      ? 'selected' : ''}>Evento</option>
      <option value="logro"       ${data.category === 'logro'       ? 'selected' : ''}>Logro</option>
    </select>
    <button class="btn-remove" type="button"><i class="fas fa-trash"></i></button>
  `;

  const fileInput = row.querySelector('.flyer-file');
  const imgInput  = row.querySelector('.flyer-image');
  const preview   = row.querySelector('.flyer-preview');

  fileInput.addEventListener('change', () => handleImageUpload(fileInput, imgInput, preview));
  row.querySelector('.btn-remove').addEventListener('click', () => row.remove());
  c.appendChild(row);
}

/* ==================================================
   BOTONES AGREGAR
================================================== */
addStatBtn     && addStatBtn.addEventListener('click',     () => addStatRow());
addTimelineBtn && addTimelineBtn.addEventListener('click', () => addTimelineRow());
addGalleryBtn  && addGalleryBtn.addEventListener('click',  () => addGalleryRow());
addFlyerBtn    && addFlyerBtn.addEventListener('click',    () => addFlyerRow());

/* ==================================================
   GUARDAR
================================================== */
btnSave && btnSave.addEventListener('click', () => {
  const data = {};

  data.school = {
    name: document.getElementById('schoolName').value.trim(),
    location: document.getElementById('schoolLocation').value.trim(),
    founded: parseInt(document.getElementById('foundedYear').value) || 1923,
    currentYear: parseInt(document.getElementById('currentYear').value) || 2026,
    yearsOfActivity: parseInt(document.getElementById('yearsActivity').value) || 103,
    motto: document.getElementById('schoolMotto').value.trim()
  };

  data.hero = {
    image: document.getElementById('heroImage').value.trim(),
    title: document.getElementById('heroTitle').value.trim(),
    subtitle: document.getElementById('heroSubtitle').value.trim(),
    stats: []
  };
  document.querySelectorAll('.stat-row').forEach(row => {
    data.hero.stats.push({
      label: row.querySelector('.stat-label').value.trim(),
      value: parseInt(row.querySelector('.stat-value').value) || 0,
      suffix: row.querySelector('.stat-suffix').value.trim()
    });
  });

  data.presentation = {
    mission: document.getElementById('mission').value.trim(),
    vision: document.getElementById('vision').value.trim()
  };

  data.history = [];
  document.querySelectorAll('.timeline-row').forEach(row => {
    data.history.push({
      year: parseInt(row.querySelector('.tl-year').value) || 0,
      title: row.querySelector('.tl-title').value.trim(),
      text: row.querySelector('.tl-text').value.trim()
    });
  });

  data.gallery = [];
  document.querySelectorAll('.gallery-row').forEach(row => {
    data.gallery.push({
      src: row.querySelector('.gal-src').value.trim(),
      alt: row.querySelector('.gal-alt').value.trim(),
      category: row.querySelector('.gal-cat').value
    });
  });

  /* Flyers */
  data.flyers = [];
  document.querySelectorAll('.flyer-row').forEach(row => {
    const imgInput = row.querySelector('.flyer-image');
    const fileInput = row.querySelector('.flyer-file');
    let image = imgInput.value.trim();

    // Si no hay ruta pero se subió archivo, usar dataURL
    const preview = row.querySelector('.flyer-preview');
    if (!image && preview && preview.src && preview.src.startsWith('data:')) {
      image = preview.src;
    }

    const title = row.querySelector('.flyer-title').value.trim();
    const desc  = row.querySelector('.flyer-desc').value.trim();
    if (!image && !title) return; // saltar vacíos

    data.flyers.push({
      image,
      title,
      description: desc,
      category: row.querySelector('.flyer-cat').value
    });
  });

  data.contact = {
    address: document.getElementById('contactAddress').value.trim(),
    phone: document.getElementById('contactPhone').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    hours: document.getElementById('contactHours').value.trim(),
    facebook: document.getElementById('contactFacebook').value.trim()
  };

  // Atajos
  data.yearsOfActivity = data.school.yearsOfActivity;
  data.heroImage = data.hero.image;
  data.mission = data.presentation.mission;
  data.vision = data.presentation.vision;

  const ok = saveAdminData(data);
  if (ok) showToast('✅ Cambios guardados correctamente');
});

/* ==================================================
   RESET
================================================== */
btnReset && btnReset.addEventListener('click', () => {
  if (confirm('¿Eliminar TODOS los cambios y restaurar los datos originales?')) {
    clearAdminData();
  }
});

/* ==================================================
   TOAST
================================================== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}