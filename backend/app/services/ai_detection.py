from ultralytics import YOLO
import os
import uuid

# Load YOLO model
model = YOLO("yolov8n.pt")


def detect_objects(image_path):

    results = model(image_path)

    output_folder = "outputs"
    os.makedirs(output_folder, exist_ok=True)

    # Create unique filename
    filename = f"{uuid.uuid4().hex}.jpg"

    output_path = os.path.join(output_folder, filename)

    # Save image with detections
    results[0].save(filename=output_path)

    return results, output_path