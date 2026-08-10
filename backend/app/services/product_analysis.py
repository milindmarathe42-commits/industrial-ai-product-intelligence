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
            "recommendation": "Capture a clearer image"
        }

    best = detections[0]

    for item in detections:

        if item["confidence"] > best["confidence"]:
            best = item

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

        condition = "Poor"

    defects = []

    if confidence < 0.70:

        defects.append(
            "Low detection confidence"
        )

    if len(detections) > 1:

        defects.append(
            "Multiple objects detected"
        )

    if len(defects) == 0:

        defects.append(
            "No visual defect identified by object detection"
        )

    if confidence < 0.70:

        recommendation = "Requires Manual Verification"

    else:

        recommendation = "Proceed to AI Visual Inspection"

    return {

        "product": product,

        "confidence": confidence,

        "condition": condition,

        "quality_score": quality_score,

        "possible_defects": defects,

        "recommendation": recommendation
    }