from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    mongodb_uri: str
    database_name: str = "biblioteca_inteligente"

    ollama_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
