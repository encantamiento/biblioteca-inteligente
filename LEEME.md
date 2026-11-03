# Biblioteca Virtual Inteligente — I.E. N.° 31166 Javier Pérez de Cuéllar

Fase 1: servidor FastAPI listo, con la estructura de carpetas completa.

## 1. Poner tu biblioteca actual
Copia tu página (index.html, app.js, css/, img/) dentro de `frontend/`.
Trabaja sobre una copia: no borres tu proyecto original.

## 2. Preparar Python (PowerShell, dentro de `backend`)
```
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```
Si PowerShell bloquea la activación:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

## 3. Instalar librerías
```
python -m pip install --upgrade pip
pip install -r requirements.txt
```
`sentence-transformers` es pesada (puede tardar varios minutos y bajar bastante).
Si solo quieres probar el servidor ahora, instala lo básico:
```
pip install fastapi "uvicorn[standard]" pymongo pydantic-settings python-dotenv
```

## 4. Configurar datos privados
Copia `.env.example` como `.env` y pega ahí tu cadena de MongoDB Atlas.
(Sin ella el servidor funciona igual; solo avisará que falta MongoDB.)

## 5. Encender el servidor
```
uvicorn main:app --reload
```
- http://127.0.0.1:8000 → mensaje de bienvenida
- http://127.0.0.1:8000/api/estado → estado de servidor, MongoDB e IA
- http://127.0.0.1:8000/docs → documentación interactiva

## 6. Abrir la web
Abre `frontend/` con Live Server de VS Code (puerto 5500, ya permitido en CORS).

## Próximas fases
2. Ollama + IA en la nube · 3. Lectura de PDF · 4. RAG y embeddings · 5. Chatbot en la web
6. Evaluaciones automáticas · 7. Machine Learning · 8. Panel docente
