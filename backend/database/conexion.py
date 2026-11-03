"""Conexión a MongoDB Atlas. Se conecta solo cuando se necesita."""
from functools import lru_cache

from pymongo import MongoClient

from config import settings


@lru_cache
def get_client() -> MongoClient:
    return MongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=4000)


def get_db():
    return get_client()[settings.mongodb_db]


def mongo_estado() -> dict:
    """Devuelve si MongoDB responde, sin romper el servidor si falla."""
    if not settings.mongodb_uri:
        return {"conectado": False, "detalle": "Falta MONGODB_URI en el archivo .env"}
    try:
        get_client().admin.command("ping")
        return {"conectado": True, "detalle": "MongoDB Atlas responde correctamente"}
    except Exception as e:  # red, usuario, IP no permitida, etc.
        return {"conectado": False, "detalle": f"No se pudo conectar: {type(e).__name__}"}
