from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from . import models
from .routers import products_router, customers_router, orders_router, dashboard_router

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    debug=settings.DEBUG,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products_router)
app.include_router(customers_router)
app.include_router(orders_router)
app.include_router(dashboard_router)


@app.on_event("startup")
async def startup_event():
    """Create database tables on application startup."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
    print(f"Models registered: {', '.join([table.name for table in Base.metadata.sorted_tables])}")


@app.get("/")
async def root():
    """Root endpoint to verify API is running."""
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Try to connect to database
        from .database import engine
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return {
            "status": "healthy",
            "service": settings.APP_NAME,
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": settings.APP_NAME,
            "database": "disconnected",
            "error": str(e)
        }