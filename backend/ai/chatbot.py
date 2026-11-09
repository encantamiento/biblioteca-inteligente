
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


async def consultar_gemini(pregunta: str, grado: int):
    if not settings.gemini_api_key:
        raise ValueError("No está configurada la clave de Gemini.")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/{settings.gemini_model}:generateContent"
    )

    datos = {
        "system_instruction": {
            "parts": [
                {"text": crear_instrucciones(grado)}
            ]
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
            "maxOutputTokens": 1500
        }
    }

    async with httpx.AsyncClient(timeout=120) as cliente:
        respuesta = await cliente.post(
            url,
            params={"key": settings.gemini_api_key},
            json=datos
        )

        respuesta.raise_for_status()
        resultado = respuesta.json()

        candidatos = resultado.get("candidates", [])

        if not candidatos:
            raise ValueError("Gemini no devolvió una respuesta.")

        partes = candidatos[0]["content"]["parts"]

        return "\n".join(
            parte["text"]
            for parte in partes
            if "text" in parte
        )


async def consultar_ia(pregunta: str, grado: int):
    proveedor = settings.ai_provider.lower()

    if proveedor == "gemini":
        return await consultar_gemini(pregunta, grado)

    if proveedor == "ollama":
        return await consultar_ollama(pregunta, grado)

    raise ValueError("El proveedor de inteligencia artificial no es válido.")
