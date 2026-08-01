from pydantic import BaseModel


class ProductUpdate(BaseModel):
    product_name: str
    confidence: float