from typing import Optional
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/inventory_db")
    
    # Application
    APP_NAME: str = os.getenv("APP_NAME", "Inventory Management System")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    API_V1_PREFIX: str = os.getenv("API_V1_PREFIX", "/api/v1")
    
# CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173", 
        "http://localhost:5174",
        "http://localhost:3000"
]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()