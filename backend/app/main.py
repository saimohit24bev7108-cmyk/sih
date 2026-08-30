from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, profiles, service_requests, bookings
from app.core.config import settings
from app.core.exceptions import global_exception_handler

allowed_origins = [origin.strip() for origin in settings.FRONTEND_URL.split(",") if origin.strip()]

app = FastAPI(title=settings.PROJECT_NAME, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(service_requests.router)
app.include_router(bookings.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}
