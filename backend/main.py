
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import verificar_conexion
from routers.chat import router as chat_router
from routers.libros import router as libros_router

app = FastAPI(
    title="Biblioteca Virtual Inteligente",
    description="API educativa de la I.E. Javier Pérez de Cuéllar",
    version="1.0.0"
)

# Permitir la comunicación con nuestra página web
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8000",
        "https://majestic-pavlova-cc01e9.netlify.app",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectar las rutas de las API
app.include_router(chat_router)
app.include_router(libros_router)


@app.get("/")
def inicio():
    return {
        "mensaje": "Biblioteca Virtual Inteligente funcionando",
        "institucion": "I.E. Javier Pérez de Cuéllar",
        "estado": "correcto"
    }


@app.get("/api/estado")
def estado():
    return {
        "servidor": "activo",
        "inteligencia_artificial": "Ollama",
        "base_de_datos": "MongoDB Atlas"
    }


@app.get("/api/database")
def comprobar_database():
    conectado = verificar_conexion()

    return {
        "mongodb": "conectado" if conectado else "desconectado"
    }
