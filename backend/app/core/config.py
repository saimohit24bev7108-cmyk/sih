from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "FixFlow API"
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    DATABASE_URL: str = "postgresql://fixflow_user:fixflow_password@localhost:5432/fixflow_db"

    class Config:
        env_file = ".env"


settings = Settings()
