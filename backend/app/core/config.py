from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "FixFlow API"
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    DATABASE_URL: str = "postgresql://fixflow_user:fixflow_password@localhost:5432/fixflow_db"

    # No default — must be supplied via .env. App will fail to start without it.
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    class Config:
        env_file = ".env"


settings = Settings()
