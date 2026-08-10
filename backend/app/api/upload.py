from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.user import User

from app.services.image_processing import process_image
from app.services.ai_detection import detect_objects
from app.services.product_analysis import analyze_product
from app.services.gemini_service import ask_gemini
from app.services.pdf_service import generate_pdf

from app.api.auth import get_current_user

import shutil
import os
import json
import uuid

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_image(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    # -------------------------------------
    # Validate File
    # -------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Invalid file."
        )


    # -------------------------------------
    # Generate Unique Filename
    # -------------------------------------

    original_filename = file.filename

    extension = os.path.splitext(
        original_filename
    )[1].lower()

    unique_filename = (
        uuid.uuid4().hex +
        extension
    )


    # -------------------------------------
    # Save Uploaded Image
    # -------------------------------------

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # -------------------------------------
    # OpenCV Processing
    # -------------------------------------

    result = process_image(
        file_path
    )


    # -------------------------------------
    # YOLO Detection
    # -------------------------------------

    results, output_path = detect_objects(
        file_path
    )

    output_path = output_path.replace(
        "\\",
        "/"
    )

    detections = []


    for box in results[0].boxes:

        class_id = int(
            box.cls[0]
        )

        class_name = results[0].names[
            class_id
        ]

        confidence = float(
            box.conf[0]
        )

        detections.append({

            "object": class_name,

            "confidence": round(
                confidence,
                2
            )

        })


    # -------------------------------------
    # Product Analysis
    # -------------------------------------

    product_result = analyze_product(
        detections
    )


    # -------------------------------------
    # Gemini AI Report
    # -------------------------------------

    ai_report = ask_gemini(

        product_result["product"],

        detections,

        file_path

    )


    # -------------------------------------
    # Generate PDF
    # -------------------------------------

    pdf_path = generate_pdf({

        "input_image": file_path,

        "output_image": (
            f"outputs/{os.path.basename(output_path)}"
        ),

        "ai_report": ai_report

    })

    pdf_path = pdf_path.replace(
        "\\",
        "/"
    )


    # -------------------------------------
    # Save into Database
    # -------------------------------------

    new_product = Product(

        user_id=current_user.id,

        # Keep original filename for display
        filename=original_filename,

        # Store UNIQUE uploaded image path
        input_image=(
            f"uploads/{unique_filename}"
        ),

        # Store UNIQUE YOLO output path
        output_image=(
            f"outputs/{os.path.basename(output_path)}"
        ),

        product_name=ai_report.get(
            "product_name",
            product_result["product"]
        ),

        confidence=product_result.get(
            "confidence",
            0
        ),

        brand=ai_report.get(
            "brand",
            "Unknown"
        ),

        category=ai_report.get(
            "category",
            "Unknown"
        ),

        condition=ai_report.get(
            "condition",
            "Unknown"
        ),

        quality_score=ai_report.get(
            "quality_score",
            0
        ),

        recommendation=ai_report.get(
            "recommendation",
            ""
        ),

        summary=ai_report.get(
            "summary",
            ""
        ),

        possible_defects=json.dumps(

            ai_report.get(
                "possible_defects",
                []
            )

        ),

        pdf_report=pdf_path

    )


    db.add(new_product)

    db.commit()

    db.refresh(new_product)


    # -------------------------------------
    # Response
    # -------------------------------------

    return {

        "message":
            "Image uploaded successfully",

        "filename":
            original_filename,

        "image_info":
            result,

        "detections":
            detections,

        "product_analysis":
            product_result,

        "ai_report":
            ai_report,

        "input_image":
            f"uploads/{unique_filename}",

        "output_image":
            (
                f"outputs/"
                f"{os.path.basename(output_path)}"
            ),

        "pdf_report":
            pdf_path,

        "database_id":
            new_product.id

    }