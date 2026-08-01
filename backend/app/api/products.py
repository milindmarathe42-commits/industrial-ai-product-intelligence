from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.product_schema import ProductUpdate

router = APIRouter()


# -----------------------------
# Get All Products
# -----------------------------
@router.get("/products")
def get_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return products


# -----------------------------
# Get Product By ID
# -----------------------------
@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


# -----------------------------
# Search Product By Name
# -----------------------------
@router.get("/products/search/{product_name}")
def search_product(product_name: str, db: Session = Depends(get_db)):

    products = db.query(Product).filter(
        Product.product_name.contains(product_name)
    ).all()

    return products


# -----------------------------
# Update Product
# -----------------------------
@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: ProductUpdate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    product.product_name = updated_product.product_name
    product.confidence = updated_product.confidence

    db.commit()
    db.refresh(product)

    return {
        "message": "Product updated successfully",
        "product": product
    }


# -----------------------------
# Delete Product
# -----------------------------
@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)

    db.commit()

    return {
        "message": "Product deleted successfully"
    }