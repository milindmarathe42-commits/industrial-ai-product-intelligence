from pydantic import BaseModel


class ProductUpdate(BaseModel):

    product_name: str

    confidence: float


class ProductResponse(BaseModel):

    id: int

    filename: str

    product_name: str

    confidence: float

    output_image: str

    brand: str | None = None

    category: str | None = None

    condition: str | None = None

    quality_score: int | None = None

    recommendation: str | None = None

    summary: str | None = None

    possible_defects: str | None = None

    pdf_report: str | None = None

    class Config:

        from_attributes = True