import httpx
from config import settings

async def consultar_ollama(pregunta: str, grado: int):

    instrucciones = f"""
    Eres un asistente educativo de la I.E.
    Javier Pérez de Cuéllar.

    Ayudas a estudiantes de primaria.
    El estudiante cursa el grado {grado}.

    Reglas:
    - Utiliza palabras sencillas.
    - Explica paso a paso.
    - Da ejemplos cotidianos.
    - Sé amable y paciente.
    - No inventes información de libros.
    - Si no sabes algo, reconócelo.
    """

    datos = {
        "model": settings.ollama_model,
        "messages": [
            {
                "role": "system",
                "content": instrucciones
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