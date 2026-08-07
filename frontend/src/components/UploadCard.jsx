import { useState } from "react";

import {
    FaCloudUploadAlt,
    FaImage,
    FaRocket,
    FaFileImage,
    FaWeightHanging
} from "react-icons/fa";

import toast from "react-hot-toast";

import api from "../services/api";

import AnalysisLoader from "./AnalysisLoader";

import "../styles/UploadCard.css";

function UploadCard({ refreshData, setResult }) {

    const [selectedImage, setSelectedImage] = useState(null);

    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);

        setPreview(URL.createObjectURL(file));

    };

    const handleUpload = async () => {

        if (!selectedImage) {

            toast.error("Please select an image.");

            return;

        }

        const formData = new FormData();

        formData.append("file", selectedImage);

        setLoading(true);

        try {

            const response = await api.post(

                "/upload",

                formData

            );

            toast.success(

                "Product analyzed successfully!"

            );

            setResult(response.data);

            refreshData();

        }

        catch (err) {

            toast.error(

                "Upload Failed!"

            );

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <>

            {

                loading &&

                <AnalysisLoader />

            }

            <div className="upload-card">

                <div className="upload-header">

                    <h2>

                        AI Product Inspection

                    </h2>

                    <p>

                        Upload a product image to begin intelligent inspection

                    </p>

                </div>

                <div className="upload-area">

                    {

                        preview ?

                        <div className="preview-wrapper">

                            <img

                                src={preview}

                                alt="preview"

                                className="preview-image"

                            />

                            <div className="image-info">

                                <div>

                                    <FaFileImage />

                                    <span>

                                        {selectedImage.name}

                                    </span>

                                </div>

                                <div>

                                    <FaWeightHanging />

                                    <span>

                                        {(selectedImage.size / 1024).toFixed(1)} KB

                                    </span>

                                </div>

                            </div>

                        </div>

                        :

                        <>

                            <FaCloudUploadAlt

                                className="upload-icon"

                            />

                            <h3 className="upload-text">

                                Drag & Drop Product Image

                            </h3>

                            <p className="upload-subtext">

                                JPG • PNG • JPEG • WEBP

                            </p>

                        </>

                    }

                    <input

                        type="file"

                        id="fileUpload"

                        hidden

                        accept="image/*"

                        onChange={handleImage}

                    />

                    <label

                        htmlFor="fileUpload"

                        className="choose-btn"

                    >

                        <FaImage />

                        Browse Images

                    </label>

                </div>

                <button

                    className="upload-btn"

                    onClick={handleUpload}

                    disabled={loading}

                >

                    {

                        loading ?

                        "Analyzing Product..."

                        :

                        <>

                            <FaRocket />

                            Analyze Product

                        </>

                    }

                </button>

            </div>

        </>

    );

}

export default UploadCard;