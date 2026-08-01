import cv2
import os


def process_image(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return None

    height, width = image.shape[:2]

    resized = cv2.resize(image, (640, 640))

    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

    output_folder = "outputs"

    os.makedirs(output_folder, exist_ok=True)

    output_path = os.path.join(output_folder, "processed_image.png")

    cv2.imwrite(output_path, gray)

    return {
        "width": width,
        "height": height,
        "processed_image": output_path
    }