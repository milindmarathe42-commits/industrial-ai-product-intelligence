from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product

from app.services.image_processing import process_image
from app.services.ai_detection import detect_objects
from app.services.product_analysis import analyze_product

import shutil
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # OpenCV Processing
    result = process_image(file_path)

    # YOLO Detection
    results, output_path = detect_objects(file_path)

    detections = []

    for box in results[0].boxes:

        class_id = int(box.cls[0])

        class_name = results[0].names[class_id]

        confidence = float(box.conf[0])

        detections.append({
            "object": class_name,
            "confidence": round(confidence, 2)
        })

    # Product Analysis
    product_result = analyze_product(detections)

    # -----------------------------
    # Save into Database
    # -----------------------------

    new_product = Product(
        filename=file.filename,
        product_name=product_result["product"],
        confidence=product_result.get("confidence", 0),
        output_image=output_path
    )

    db.add(new_product)

    db.commit()

    db.refresh(new_product)

    # -----------------------------

    return {
        "message": "Image uploaded successfully",
        "filename": file.filename,
        "image_info": result,
        "detections": detections,
        "product_analysis": product_result,
        "output_image": output_path,
        "database_id": new_product.id
    }