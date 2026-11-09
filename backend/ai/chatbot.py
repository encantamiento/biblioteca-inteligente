
import httpx
from config import settings


def crear_instrucciones(grado: int):
    return f"""
Eres un asistente educativo de la I.E. Javier Pérez de Cuéllar.

El estudiante cursa el grado {grado} de primaria.

Tus reglas:
- Utiliza palabras sencillas y apropiadas para su edad.
- Explica paso a paso.
- Da ejemplos cotidianos.
- Sé amable y paciente.
- No inventes información sobre los libros.
- Si no conoces una respuesta, reconócelo.
- Ayuda al estudiante a comprender, no solamente a copiar.
"""


async def consultar_ollama(pregunta: str, grado: int):
    datos = {
        "model": settings.ollama_model,
        "messages": [
            {
                "role": "system",
                "content": crear_instrucciones(grado)
            },
            {
                "role": "user",
                "content": pregunta
            }
        ],
        "stream": False
    }

    async with httpx.AsyncClient(timeout=180) as cliente:
        respuesta = await cliente.post(
            f"{settings.ollama_url}/api/chat",
            json=datos
        )

        respuesta.raise_for_status()
        resultado = respuesta.json()

        return resultado["message"]["content"]



import httpx
from config import settings


async def consultar_gemini(pregunta: str, grado: int):
    if not settings.gemini_api_key:
        raise ValueError("Falta configurar GEMINI_API_KEY en Render.")

    url = (
        "https://generativelanguage.googleapis.com/"
        "v1beta/models/"
        f"{settings.gemini_model}:generateContent"
    )

    instrucciones = f"""
    Eres el asistente educativo de la I.E. Javier Pérez de Cuéllar.
    El estudiante cursa {grado} grado de primaria.
    Explica con palabras sencillas, ejemplos y paciencia.
    No inventes información de libros que no hayas consultado.
    """

    datos = {
        "system_instruction": {
            "parts": [{"text": instrucciones}]
        },
        "contents": [
            {
                "parts": [
                    {"text": pregunta}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 1200
        }
    }

    async with httpx.AsyncClient(timeout=90) as cliente:
        respuesta = await cliente.post(
            url,
            headers={
                "x-goog-api-key": settings.gemini_api_key,
                "Content-Type": "application/json"
            },
            json=datos
        )

        if respuesta.is_error:
            print(
                "Error Gemini:",
                respuesta.status_code,
                respuesta.text[:1500]
            )

        respuesta.raise_for_status()

        resultado = respuesta.json()
        candidatos = resultado.get("candidates", [])

        if not candidatos:
            raise ValueError("Gemini no devolvió candidatos.")

        partes = candidatos[0].get("content", {}).get("parts", [])

        texto = "\n".join(
            parte["text"]
            for parte in partes
            if "text" in parte
        )

        if not texto:
            raise ValueError("Gemini no devolvió texto.")

        return texto



async def consultar_ia(pregunta: str, grado: int):
    proveedor = settings.ai_provider.lower()

    if proveedor == "gemini":
        return await consultar_gemini(pregunta, grado)

    if proveedor == "ollama":
        return await consultar_ollama(pregunta, grado)

    raise ValueError("El proveedor de inteligencia artificial no es válido.")
