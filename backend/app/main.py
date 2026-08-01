from fastapi import FastAPI

from app.api.upload import router as upload_router
from app.api.products import router as products_router
from app.api.dashboard import router as dashboard_router
from app.api.search import router as search_router

from app.database import engine, Base

from app.models.product import Product


# Create Database Tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Industrial AI Product Intelligence",
    description="AI Powered Product Intelligence Platform",
    version="1.0.0"
)


# Register Routers
app.include_router(upload_router)
app.include_router(products_router)
app.include_router(dashboard_router)
app.include_router(search_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Industrial AI Product Intelligence Platform",
        "status": "Backend Running Successfully"
    }