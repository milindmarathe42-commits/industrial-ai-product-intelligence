from ultralytics import YOLO
import os
import uuid

model = YOLO("yolov8n.pt")


def detect_objects(image_path):

    results = model(image_path)

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    output_folder = os.path.join(BASE_DIR, "outputs")

    os.makedirs(output_folder, exist_ok=True)

    filename = f"{uuid.uuid4().hex}.jpg"

    output_path = os.path.join(output_folder, filename)

    results[0].save(filename=output_path)

    print("=" * 60)
    print("Saved image to:")
    print(output_path)
    print("Exists:", os.path.exists(output_path))
    print("=" * 60)

    # This is the path stored in database
    db_path = f"outputs/{filename}"

    return results, db_path