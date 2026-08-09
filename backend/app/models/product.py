from sqlalchemy import Column, Integer, String, Float, Text

from app.database import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    # User who uploaded the product
    user_id = Column(Integer, nullable=True, index=True)

    filename = Column(String)

    # Original Uploaded Image
    input_image = Column(String)

    # AI Detected Image
    output_image = Column(String)

    # Basic Product Details
    product_name = Column(String)

    confidence = Column(Float)

    # AI Report
    brand = Column(String)

    category = Column(String)

    condition = Column(String)

    quality_score = Column(Integer)

    recommendation = Column(Text)

    summary = Column(Text)

    possible_defects = Column(Text)

    # Generated PDF Report
    pdf_report = Column(String)