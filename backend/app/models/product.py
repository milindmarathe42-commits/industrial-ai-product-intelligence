from sqlalchemy import Column, Integer, String, Float

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    product_name = Column(String)

    confidence = Column(Float)

    output_image = Column(String)