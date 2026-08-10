import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def get_category(product):

    product = product.lower()

    if product in ["car", "truck", "bus", "motorcycle", "bicycle"]:
        return "Automobile"

    if product in [
        "bottle",
        "cup",
        "bowl",
        "vase"
    ]:
        return "Packaging"

    if product in [
        "laptop",
        "cell phone",
        "keyboard",
        "mouse",
        "tv",
        "remote"
    ]:
        return "Electronics"

    if product in [
        "chair",
        "couch",
        "bed"
    ]:
        return "Furniture"

    if product in [
        "motor",
        "engine"
    ]:
        return "Industrial Equipment"

    return "Unknown"


def get_best_confidence(detections):

    if not detections:

        return 0

    best = detections[0]

    for detection in detections:

        if detection["confidence"] > best["confidence"]:

            best = detection

    return best["confidence"]


def ask_gemini(product_name, detections, image_path):

    prompt = f"""
You are an Industrial Quality Inspection AI.

Analyze the PROVIDED PRODUCT IMAGE together with the YOLO
detection information.

Your job is to create a professional inspection report.

IMPORTANT:

1. The IMAGE is the primary source of truth.
2. YOLO detections are supporting information only.
3. Do NOT blindly trust the YOLO class.
4. If YOLO says "truck" but the image clearly shows another
   object, use the visual evidence from the image.
5. Never invent a brand.
6. Only provide a brand if it is clearly visible or confidently
   identifiable from the image.
7. If the brand cannot be identified, return "Unknown".
8. Do not invent model numbers.
9. Do not invent physical defects.
10. Only mention defects that are actually visible in the image.
11. If the image quality is insufficient for inspection,
    clearly mention that.
12. The quality score must reflect the overall visual inspection,
    not simply YOLO confidence.
13. Return ONLY valid JSON.
14. Do not use markdown.
15. Do not add explanations outside the JSON.

YOLO DETECTION INFORMATION:

Primary YOLO Product:
{product_name}

YOLO Detections:
{json.dumps(detections)}

Return exactly this JSON structure:

{{
"product_name": "",
"brand": "",
"category": "",
"condition": "",
"quality_score": 0,
"possible_defects": [],
"recommendation": "",
"summary": ""
}}

PRODUCT NAME:

Identify the actual visible product from the image.

If uncertain:

"Unknown"

BRAND:

Identify the manufacturer/brand only when there is sufficient
visual evidence.

If not clearly identifiable:

"Unknown"

CATEGORY:

Choose an appropriate category.

Examples:

Automobile
Electronics
Packaging
Furniture
Kitchenware
Industrial Equipment

CONDITION:

Use only:

Excellent
Good
Average
Poor
Unknown

QUALITY SCORE:

Return an integer from 0 to 100.

Base it on visible product condition, image quality,
inspection confidence and visible defects.

Do NOT simply copy the YOLO confidence.

POSSIBLE DEFECTS:

Only mention defects that are visibly supported by the image.

If no defect can be visually confirmed:

[]

RECOMMENDATION:

Give a professional industrial recommendation.

Examples:

"Approved for further processing"
"Requires Manual Verification"
"Needs Better Image Capture"
"Requires Maintenance Inspection"

SUMMARY:

Write a professional 2-3 sentence inspection summary based
on the image and available detection information.
"""

    try:

        # -------------------------------------
        # Read Image
        # -------------------------------------

        with open(image_path, "rb") as image_file:

            image_bytes = image_file.read()


        # -------------------------------------
        # Detect Image Type
        # -------------------------------------

        extension = os.path.splitext(
            image_path
        )[1].lower()

        if extension == ".png":

            mime_type = "image/png"

        elif extension == ".webp":

            mime_type = "image/webp"

        else:

            mime_type = "image/jpeg"


        # -------------------------------------
        # Gemini Vision Analysis
        # -------------------------------------

        response = client.models.generate_content(

            model="gemini-3.5-flash",

            contents=[

                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type
                ),

                prompt

            ]
        )


        text = response.text.strip()


        # -------------------------------------
        # Remove Markdown JSON if returned
        # -------------------------------------

        if text.startswith("```"):

            text = text.replace(
                "```json",
                ""
            )

            text = text.replace(
                "```",
                ""
            )

            text = text.strip()


        return json.loads(text)


    except Exception as e:

        # -------------------------------------
        # Gemini Error
        # -------------------------------------

        print("=" * 60)
        print("Gemini Error:")
        print(str(e))
        print("=" * 60)


        error_message = str(e).lower()


        # -------------------------------------
        # Get YOLO Fallback Information
        # -------------------------------------

        confidence = get_best_confidence(
            detections
        )

        quality_score = int(
            confidence * 100
        )


        category = get_category(
            product_name
        )


        # -------------------------------------
        # Condition Based On YOLO Confidence
        # -------------------------------------

        if confidence >= 0.90:

            condition = "Excellent"

        elif confidence >= 0.70:

            condition = "Good"

        elif confidence >= 0.50:

            condition = "Average"

        else:

            condition = "Unknown"


        # -------------------------------------
        # 429 Rate Limit
        # -------------------------------------

        if "429" in error_message:

            summary = (

                "Gemini AI visual analysis is temporarily "
                "unavailable because the API rate limit has "
                "been reached. The product was successfully "
                "detected using the YOLO detection engine. "
                "Manual verification is recommended for the "
                "complete inspection."

            )


        # -------------------------------------
        # 503 Service Unavailable
        # -------------------------------------

        elif "503" in error_message or "unavailable" in error_message:

            summary = (

                "Gemini AI visual analysis is temporarily "
                "unavailable. The product was successfully "
                "detected using the YOLO detection engine. "
                "Manual verification is recommended."

            )


        # -------------------------------------
        # Authentication Error
        # -------------------------------------

        elif (
            "401" in error_message
            or "403" in error_message
        ):

            summary = (

                "Gemini AI authentication failed. "
                "The product was successfully detected "
                "using the YOLO detection engine. "
                "Please verify the configured Gemini API key."

            )


        # -------------------------------------
        # Other Error
        # -------------------------------------

        else:

            summary = (

                "Gemini AI visual inspection could not "
                "be completed. The product was successfully "
                "detected using the YOLO detection engine. "
                "Manual verification is recommended."

            )


        # -------------------------------------
        # YOLO Fallback Report
        # -------------------------------------

        return {

            "product_name":
                product_name,

            "brand":
                "Unknown",

            "category":
                category,

            "condition":
                condition,

            "quality_score":
                quality_score,

            "possible_defects": [

                "AI visual inspection unavailable",

                "Manual inspection recommended"

            ],

            "recommendation":
                "Requires Manual Verification",

            "summary":
                summary

        }