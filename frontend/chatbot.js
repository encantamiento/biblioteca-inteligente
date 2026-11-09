const API_URL = "https://biblioteca-inteligente-iirc.onrender.com/";

const abrirChat = document.getElementById("abrirChat");
const cerrarChat = document.getElementById("cerrarChat");
const ventanaChat = document.getElementById("ventanaChat");

const mensajesChat = document.getElementById("mensajesChat");
const preguntaChat = document.getElementById("preguntaChat");
const gradoChat = document.getElementById("gradoChat");
const enviarChat = document.getElementById("enviarChat");

abrirChat.addEventListener("click", () => {
    ventanaChat.hidden = false;
});

cerrarChat.addEventListener("click", () => {
    ventanaChat.hidden = true;
});

function agregarMensaje(texto, tipo) {
    const mensaje = document.createElement("div");

    mensaje.className = `mensaje ${tipo}`;
    mensaje.textContent = texto;

    mensajesChat.appendChild(mensaje);
    mensajesChat.scrollTop = mensajesChat.scrollHeight;

    return mensaje;
}

async function enviarPregunta() {

    const pregunta = preguntaChat.value.trim();

    if (!pregunta) return;

    agregarMensaje(pregunta, "usuario");

    preguntaChat.value = "";
    enviarChat.disabled = true;

    const cargando = agregarMensaje(
        "Estoy pensando...",
        "ia"
    );

    try {

        const respuesta = await fetch(
            `${API_URL}/api/chat/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    mensaje: pregunta,
                    grado: Number(gradoChat.value)
                })
            }
        );

        if (!respuesta.ok) {
            throw new Error("Error del servidor");
        }

        const datos = await respuesta.json();

        cargando.textContent = datos.respuesta;

    } catch (error) {

        cargando.textContent =
            "No pude conectarme. Comprueba que FastAPI y Ollama estén funcionando.";

        console.error(error);

    } finally {

        enviarChat.disabled = false;

    }
}

enviarChat.addEventListener("click", enviarPregunta);

preguntaChat.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        enviarPregunta();
    }
});