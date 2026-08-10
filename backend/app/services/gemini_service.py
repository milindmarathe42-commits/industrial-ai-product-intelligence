import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


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

Examples:

Hyundai
Toyota
Samsung
Apple

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

Examples:

"Visible surface damage"
"Visible dent"
"Visible crack"
"Visible rust"
"Damaged component"
"Object partially visible"
"Low image quality"
"Low inspection confidence"

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

        with open(image_path, "rb") as image_file:

            image_bytes = image_file.read()

        response = client.models.generate_content(

            model="gemini-3.5-flash",

            contents=[

                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type="image/jpeg"
                ),

                prompt

            ]
        )

        text = response.text.strip()

        return json.loads(text)

    except Exception as e:

        print("=" * 60)
        print("Gemini Error:")
        print(str(e))
        print("=" * 60)

        error_message = str(e).lower()

        if "503" in error_message or "unavailable" in error_message:

            summary = (
                "Gemini AI is temporarily unavailable. "
                "The YOLO detection was completed successfully. "
                "Please try the inspection again later."
            )

        elif "429" in error_message:

            summary = (
                "Gemini API rate limit has been reached. "
                "The YOLO detection was completed successfully. "
                "Please wait before trying again."
            )

        elif "401" in error_message or "403" in error_message:

            summary = (
                "Gemini API authentication failed. "
                "Please verify the configured API key."
            )

        else:

            summary = (
                "AI visual inspection could not be completed. "
                "The YOLO detection engine completed successfully."
            )

        return {

            "product_name": product_name,

            "brand": "Unknown",

            "category": "Unknown",

            "condition": "Unknown",

            "quality_score": 0,

            "possible_defects": [
                "AI visual inspection unavailable",
                "Manual inspection recommended"
            ],

            "recommendation":
                "Manual inspection required",

            "summary": summary
        }