from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.product import Product

router = APIRouter()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    total_products = db.query(Product).count()

    average_confidence = db.query(
        func.avg(Product.confidence)
    ).scalar()

    if average_confidence is None:
        average_confidence = 0

    good_products = db.query(Product).filter(
        Product.confidence >= 0.70
    ).count()

    poor_products = db.query(Product).filter(
        Product.confidence < 0.70
    ).count()

    return {
        "total_products": total_products,
        "good_products": good_products,
        "poor_products": poor_products,
        "average_confidence": round(average_confidence * 100, 2)
    }