from ultralytics import YOLO
import os

# Load YOLO model
model = YOLO("yolov8n.pt")


def detect_objects(image_path):

    results = model(image_path)

    output_folder = "outputs"

    os.makedirs(output_folder, exist_ok=True)

    output_path = os.path.join(output_folder, "detected_image.jpg")

    # Save image with bounding boxes
    results[0].save(filename=output_path)

    return results, output_path