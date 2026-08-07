import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_gemini(product_name, detections):

    prompt = f"""
You are an Industrial Quality Inspection AI used in manufacturing industries.

Your responsibility is to generate a structured inspection report ONLY from the detected objects.

IMPORTANT RULES:

1. Never invent product names.
2. Never invent brands.
3. If the brand is unknown, return "Unknown".
4. Use ONLY the detected objects provided.
5. Do NOT hallucinate.
6. Do NOT assume colors, materials, manufacturers or model numbers.
7. If confidence is low, recommend manual inspection.
8. Return ONLY valid JSON.
9. No markdown.
10. No explanation.
11. No extra text.

Primary Detected Product:
{product_name}

Detected Objects:
{detections}

Return JSON in this exact format:

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

Field Instructions:

product_name:
- Use ONLY the detected primary product.
- Never invent another product.

brand:
- Return "Unknown" unless the brand is clearly identifiable.

category:
Choose the most appropriate category.

Examples:
Bottle -> Packaging
Person -> Human
Car -> Automobile
Laptop -> Electronics
Phone -> Electronics
Chair -> Furniture
Bowl -> Kitchenware
Cup -> Kitchenware
Keyboard -> Electronics

condition:
Return ONLY one of:
Excellent
Good
Average
Poor

quality_score:
Return an integer between 0 and 100 based on the overall detection confidence.

possible_defects:
Mention only realistic inspection observations such as:

- Low detection confidence
- Object partially visible
- Object partially occluded
- Image quality is low
- Manual inspection recommended

Do NOT invent:
- Scratches
- Rust
- Cracks
- Missing parts
- Dents

unless they are actually visible from the detected information.

recommendation:
Give a short industrial recommendation.

Examples:
"Ready for Inspection"
"Ready for Packaging"
"Requires Manual Verification"
"Needs Better Image Capture"

summary:
Write a professional 2-3 sentence industrial inspection summary based ONLY on the detected objects.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        text = response.text.strip()

        return json.loads(text)

    except Exception as e:

        error_message = str(e).lower()

        if "503" in error_message or "unavailable" in error_message:

            summary = (
                "Gemini AI is temporarily unavailable due to high server demand. "
                "The inspection was successfully completed using the YOLO detection engine. "
                "Please try again later to generate the AI summary."
            )

        elif "429" in error_message:

            summary = (
                "Gemini API rate limit has been reached. "
                "The inspection was completed successfully using YOLO detection. "
                "Please wait a few moments before trying again."
            )

        elif "401" in error_message or "403" in error_message:

            summary = (
                "Gemini API authentication failed. "
                "Please verify the configured API key."
            )

        else:

            summary = (
                "AI summary could not be generated at this time. "
                "The product inspection completed successfully using the YOLO detection engine."
            )

        return {
            "product_name": product_name,
            "brand": "Unknown",
            "category": "Unknown",
            "condition": "Unknown",
            "quality_score": 0,
            "possible_defects": [
                "AI summary unavailable",
                "Manual inspection recommended"
            ],
            "recommendation": "Manual inspection required",
            "summary": summary
        }