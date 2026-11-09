from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ai.chatbot import consultar_ollama
import httpx

router = APIRouter(
    prefix="/api/chat",
    tags=["Asistente educativo"]
)

class Pregunta(BaseModel):
    mensaje: str = Field(min_length=2, max_length=2000)
    grado: int = Field(ge=1, le=6)


@router.post("/")
async def conversar(datos: Pregunta):

    try:
        respuesta = await consultar_ia(
            datos.mensaje, 
            datos.grado
        )

        return {
            "pregunta": datos.mensaje,
            "respuesta": respuesta,
            "grado": datos.grado,
            "modelo": "Ollama"
        }
    except ValueError as error:
    raise HTTPException(
        status_code=503, 
        detail=str(error)
        )
        
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="No se pudo conectar con Ollama."
        )

    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=502,
            detail="Ollama devolvió un error."
        )