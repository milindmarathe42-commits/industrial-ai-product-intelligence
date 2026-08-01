from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product

router = APIRouter()


@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if product is None:
        return {
            "message": "Product not found"
        }

    return product


@router.get("/products/search/{product_name}")
def search_product(product_name: str,
                   db: Session = Depends(get_db)):

    products = db.query(Product).filter(
        Product.product_name.ilike(f"%{product_name}%")
    ).all()

    return products