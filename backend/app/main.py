from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlalchemy import inspect, text

from app.database import Base, engine

from app.api.upload import router as upload_router
from app.api.products import router as product_router
from app.api.dashboard import router as dashboard_router
from app.api.auth import router as auth_router


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# DATABASE MIGRATION
# =========================================================

inspector = inspect(engine)

product_columns = [
    column["name"]
    for column in inspector.get_columns("products")
]

if "user_id" not in product_columns:

    with engine.begin() as connection:

        connection.execute(
            text(
                "ALTER TABLE products ADD COLUMN user_id INTEGER"
            )
        )


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Industrial AI Product Intelligence Platform"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=ALLOWED_ORIGINS,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# STATIC FILES
# =========================================================

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


# =========================================================
# API ROUTES
# =========================================================

app.include_router(upload_router)

app.include_router(product_router)

app.include_router(dashboard_router)

app.include_router(auth_router)