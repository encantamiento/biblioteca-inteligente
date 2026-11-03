
from pymongo import MongoClient
from config import settings

client = MongoClient(
    settings.mongodb_uri,
    serverSelectionTimeoutMS=10000
)

db = client[settings.database_name]


def verificar_conexion():
    try:
        client.admin.command("ping")
        print("MongoDB Atlas conectado correctamente")
        return True

    except Exception as error:
        print("Error de conexión:", error)
        return False
