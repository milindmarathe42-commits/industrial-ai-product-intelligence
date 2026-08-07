import { FaTimes } from "react-icons/fa";
import "../styles/ImageViewer.css";

function ImageViewer({ image, onClose }) {

    if (!image) return null;

    return (

        <div
            className="viewer-overlay"
            onClick={onClose}
        >

            <div
                className="viewer-content"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="viewer-close"
                    onClick={onClose}
                >

                    <FaTimes />

                </button>

                <img
                    src={image}
                    alt="Preview"
                    className="viewer-image"
                />

            </div>

        </div>

    );

}

export default ImageViewer;