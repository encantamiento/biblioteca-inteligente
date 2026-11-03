/* ==================================================
   REPRODUCTOR DE AUDIO CON VISUALIZADOR
================================================== */

const hymnAudio = document.getElementById('hymnAudio');
const playBtn = document.getElementById('playBtn');
const progressFill = document.getElementById('progressFill');
const visualizerToggle = document.getElementById('visualizerToggle');
const audioVisualizer = document.getElementById('audioVisualizer');

let isPlaying = false;
let visualizerActive = false;
let audioContext = null;
let analyser = null;
let source = null;
let animFrame = null;

// Reproducir / Pausar
if (playBtn && hymnAudio) {
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            hymnAudio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.classList.remove('playing');
        } else {
            hymnAudio.play().catch(() => {});
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.classList.add('playing');
            setupVisualizer();
        }
        isPlaying = !isPlaying;
    });
}

// Barra de progreso
if (hymnAudio && progressFill) {
    hymnAudio.addEventListener('timeupdate', () => {
        const pct = (hymnAudio.currentTime / hymnAudio.duration) * 100;
        progressFill.style.width = pct + '%';
    });

    hymnAudio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('playing');
    });
}

// Visualizador de audio
function setupVisualizer() {
    if (audioContext) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(hymnAudio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 64;
    } catch (e) {
        return;
    }
}

function drawVisualizer() {
    if (!visualizerActive || !analyser) {
        if (animFrame) cancelAnimationFrame(animFrame);
        return;
    }
    animFrame = requestAnimationFrame(drawVisualizer);

    const bars = audioVisualizer.querySelectorAll('.viz-bar');
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    bars.forEach((bar, i) => {
        const value = data[i] || 0;
        const height = Math.max(2, (value / 255) * 100);
        bar.style.height = height + '%';
    });
}

if (visualizerToggle && audioVisualizer) {
    visualizerToggle.addEventListener('click', () => {
        visualizerActive = !visualizerActive;
        visualizerToggle.classList.toggle('active', visualizerActive);
        audioVisualizer.classList.toggle('active', visualizerActive);
        if (visualizerActive && isPlaying) {
            drawVisualizer();
        }
    });
}

// Cuando el audio se reproduce, si el visualizador está activo, animarlo
if (hymnAudio) {
    hymnAudio.addEventListener('play', () => {
        if (visualizerActive) drawVisualizer();
    });
    hymnAudio.addEventListener('pause', () => {
        if (animFrame) cancelAnimationFrame(animFrame);
    });
}