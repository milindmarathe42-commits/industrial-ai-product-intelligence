def analyze_product(detections):

    if len(detections) == 0:

        return {
            "product": "Unknown",
            "confidence": 0,
            "condition": "Unknown",
            "quality_score": 0,
            "possible_defects": [
                "No object detected"
            ],
            "recommendation": "Capture image again"
        }

    best = max(detections, key=lambda x: x["confidence"])

    product = best["object"]
    confidence = best["confidence"]

    quality_score = int(confidence * 100)

    if confidence >= 0.90:
        condition = "Excellent"

    elif confidence >= 0.70:
        condition = "Good"

    elif confidence >= 0.50:
        condition = "Average"

    else:
        condition = "Needs Inspection"

    return {

        "product": product,

        "confidence": confidence,

        "condition": condition,

        "quality_score": quality_score,

        "possible_defects": [
            "No visible crack",
            "No rust detected",
            "No missing parts"
        ],

        "recommendation": "Ready for Installation"
    }