from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

from app.api.upload import router as upload_router
from app.api.products import router as product_router
from app.api.dashboard import router as dashboard_router
from app.api.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Industrial AI Product Intelligence Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.mount(
    "/outputs",
    StaticFiles(directory="outputs"),
    name="outputs"
)

app.mount(
    "/reports",
    StaticFiles(directory="reports"),
    name="reports"
)

app.include_router(upload_router)

app.include_router(product_router)

app.include_router(dashboard_router)

app.include_router(auth_router)