from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database.db import db

router = APIRouter(
    prefix="/api/libros",
    tags=["Libros"]
)

coleccion = db["libros"]


class Libro(BaseModel):
    titulo: str = Field(min_length=2)
    grado: int = Field(ge=1, le=6)
    materia: str
    pdf_url: str


@router.get("/")
def listar_libros():

    try:
        libros = list(
            coleccion.find({}, {"_id": 0})
        )

        return {
            "total": len(libros),
            "libros": libros
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="No se pudieron consultar los libros."
        )


@router.post("/")
def agregar_libro(libro: Libro):

    try:
        resultado = coleccion.insert_one(
            libro.model_dump()
        )

        return {
            "mensaje": "Libro registrado correctamente",
            "id": str(resultado.inserted_id)
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="No se pudo registrar el libro."
        )