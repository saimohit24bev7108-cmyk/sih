from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.responses import ApiResponse
from app.core.exceptions import global_exception_handler
from app.db.session import get_db

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)

@app.get("/api/health", response_model=ApiResponse[dict])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return ApiResponse(
            success=True, 
            message="API is healthy", 
            data={"database": "connected", "environment": settings.ENVIRONMENT}
        )
    except Exception as e:
        return ApiResponse(
            success=False, 
            message="Database connection failed", 
            error=str(e)
        )
