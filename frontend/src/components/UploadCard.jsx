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


    // Convert and resize image before uploading
    const compressImage = (file) => {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = (event) => {

                const img = new Image();

                img.onload = () => {

                    const maxWidth = 1600;
                    const maxHeight = 1600;

                    let width = img.width;
                    let height = img.height;


                    if (width > maxWidth) {

                        height =
                            (height * maxWidth) / width;

                        width = maxWidth;

                    }


                    if (height > maxHeight) {

                        width =
                            (width * maxHeight) / height;

                        height = maxHeight;

                    }


                    const canvas =
                        document.createElement("canvas");

                    canvas.width = width;
                    canvas.height = height;


                    const ctx =
                        canvas.getContext("2d");

                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );


                    canvas.toBlob(

                        (blob) => {

                            if (!blob) {

                                reject(
                                    new Error(
                                        "Image compression failed"
                                    )
                                );

                                return;

                            }


                            const compressedFile =
                                new File(
                                    [blob],
                                    "product-image.jpg",
                                    {
                                        type: "image/jpeg"
                                    }
                                );


                            resolve(compressedFile);

                        },

                        "image/jpeg",

                        0.80

                    );

                };


                img.onerror = () => {

                    reject(
                        new Error(
                            "Unable to process image"
                        )
                    );

                };


                img.src = event.target.result;

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Unable to read image"
                    )
                );

            };


            reader.readAsDataURL(file);

        });

    };


    const handleUpload = async () => {

        if (!selectedImage) {

            toast.error(
                "Please select an image."
            );

            return;

        }


        setLoading(true);


        try {

            console.log(
                "Original image size:",
                selectedImage.size
            );


            const compressedImage =
                await compressImage(
                    selectedImage
                );


            console.log(
                "Compressed image size:",
                compressedImage.size
            );


            const formData = new FormData();

            formData.append(
                "file",
                compressedImage
            );


            console.log(
                "Sending image to server..."
            );


            const response = await api.post(
                "/upload",
                formData,
                {
                    timeout: 180000
                }
            );


            console.log(
                "Server response:",
                response.data
            );


            toast.success(
                "Product analyzed successfully!"
            );


            setResult(response.data);

            refreshData();

        }

        catch (err) {

            console.error(
                "Upload error:",
                err
            );


            if (
                err.code === "ECONNABORTED"
            ) {

                toast.error(
                    "Analysis timed out. Please try again."
                );

            }

            else if (
                err.response
            ) {

                toast.error(
                    err.response.data?.detail ||
                    "Server error during analysis."
                );

            }

            else {

                toast.error(
                    "Unable to connect to server."
                );

            }

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

                                        {
                                            (
                                                selectedImage.size /
                                                1024
                                            ).toFixed(1)
                                        }

                                        KB

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
