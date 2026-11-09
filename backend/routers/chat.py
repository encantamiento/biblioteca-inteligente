
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ai.chatbot import consultar_ia
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
            "modelo": "IA configurada"
        }

    except httpx.HTTPStatusError as error:
        print("Error HTTP de IA:", error.response.status_code)
        print("Detalle:", error.response.text[:1500])

        raise HTTPException(
            status_code=502,
            detail="El proveedor de IA rechazó la solicitud. Revisa los logs de Render."
        )

    except httpx.RequestError as error:
        print("Error de conexión con IA:", repr(error))

        raise HTTPException(
            status_code=503,
            detail="No se pudo establecer conexión con el proveedor de IA."
        )

    except ValueError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error)
        )

    except Exception as error:
        print("Error inesperado en chatbot:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error interno en el asistente."
        )
