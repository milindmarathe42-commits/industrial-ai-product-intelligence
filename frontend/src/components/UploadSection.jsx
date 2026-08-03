import { useState } from "react";
import "../styles/UploadSection.css";
import api from "../services/api";
import AnalysisResult from "./AnalysisResult";

function UploadSection({ refreshData }) {

    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));

    };

    const handleUpload = async () => {

        if (!selectedImage) {

            alert("Please select an image.");

            return;

        }

        const formData = new FormData();

        formData.append("file", selectedImage);

        try {

            const response = await api.post("/upload", formData);

            console.log(response.data);

            setResult(response.data);

            // Refresh Dashboard & Product Table
            refreshData();

            alert("Image Uploaded Successfully!");

        }

        catch (error) {

            console.log(error);

            alert("Upload Failed");

        }

    };

    return (

        <div className="upload-container">

            <h2>Upload Product Image</h2>

            <div className="upload-box">

                {
                    preview ?

                        <img
                            src={preview}
                            alt="preview"
                            className="preview-image"
                        />

                        :

                        <>
                            <p>Drag & Drop Image Here</p>
                            <span>OR</span>
                        </>
                }

                <input
                    type="file"
                    onChange={handleImage}
                />

            </div>

            <button
                className="analyze-btn"
                onClick={handleUpload}
            >
                Analyze Product
            </button>

            <AnalysisResult result={result} />

        </div>

    );

}

export default UploadSection;