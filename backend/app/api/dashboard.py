from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.product import Product

router = APIRouter()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    total_products = len(products)

    good_products = len([
        p for p in products
        if p.confidence >= 0.5
    ])

    damaged_products = total_products - good_products

    average_confidence = db.query(
        func.avg(Product.confidence)
    ).scalar()

    if average_confidence is None:
        average_confidence = 0

    return {
        "total_products": total_products,
        "good_products": good_products,
        "damaged_products": damaged_products,
        "average_confidence": round(average_confidence * 100, 2)
    }