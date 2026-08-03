from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os

from app.api.upload import router as upload_router
from app.api.products import router as products_router
from app.api.dashboard import router as dashboard_router
from app.api.search import router as search_router

from app.database import engine, Base
from app.models.product import Product


# ==========================
# Create Database Tables
# ==========================

Base.metadata.create_all(bind=engine)


# ==========================
# Create Required Folders
# ==========================

os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)


# ==========================
# FastAPI App
# ==========================

app = FastAPI(
    title="Industrial AI Product Intelligence",
    description="AI Powered Product Intelligence Platform",
    version="1.0.0"
)


# ==========================
# Enable CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# Serve Static Images
# ==========================

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")


# ==========================
# Register Routers
# ==========================

app.include_router(upload_router)
app.include_router(products_router)
app.include_router(dashboard_router)
app.include_router(search_router)


# ==========================
# Home Route
# ==========================

@app.get("/")
def home():
    return {
        "message": "Welcome to Industrial AI Product Intelligence Platform",
        "status": "Backend Running Successfully"
    }