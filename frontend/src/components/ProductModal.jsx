import { useState } from "react";

import "../styles/ProductModal.css";

import {
    FaTimes,
    FaBoxOpen,
    FaIndustry,
    FaTag,
    FaCheckCircle,
    FaDownload,
    FaRobot,
    FaExclamationTriangle,
    FaStar,
    FaImages
} from "react-icons/fa";

import ImageComparisonViewer from "./ImageComparisonViewer";

import api from "../services/api";

function ProductModal({ product, onClose }) {

    const [compareOpen, setCompareOpen] = useState(false);

    if (!product) return null;

    let defects = [];

    try {
        defects = JSON.parse(product.possible_defects || "[]");
    }
    catch {
        defects = [];
    }

    const backendUrl = api.defaults.baseURL;

    const originalImage = `${backendUrl}/${product.input_image}`;
    const detectedImage = `${backendUrl}/${product.output_image}`;
    const pdfUrl = `${backendUrl}/${product.pdf_report}`;

    return (
        <>
            {
                compareOpen &&
                <ImageComparisonViewer
                    original={originalImage}
                    detected={detectedImage}
                    onClose={() => setCompareOpen(false)}
                />
            }

            <div className="modal-overlay">

                <div className="modal-card">

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                    <h2>
                        <FaRobot />
                        Product Inspection Details
                    </h2>

                    <div className="modal-top">

                        <div className="image-comparison">

                            <div className="image-box">

                                <h3>
                                    Original Image
                                </h3>

                                <img
                                    src={originalImage}
                                    alt="Original"
                                />

                            </div>

                            <div className="image-box">

                                <h3>
                                    AI Detection
                                </h3>

                                <img
                                    src={detectedImage}
                                    alt="Detected"
                                />

                            </div>

                        </div>

                        <div className="modal-info">

                            <div className="info-row">

                                <FaBoxOpen />

                                <span>
                                    Product
                                </span>

                                <b>
                                    {product.product_name}
                                </b>

                            </div>

                            <div className="info-row">

                                <FaIndustry />

                                <span>
                                    Brand
                                </span>

                                <b>
                                    {product.brand}
                                </b>

                            </div>

                            <div className="info-row">

                                <FaTag />

                                <span>
                                    Category
                                </span>

                                <b>
                                    {product.category}
                                </b>

                            </div>

                            <div className="info-row">

                                <FaCheckCircle />

                                <span>
                                    Condition
                                </span>

                                <b>
                                    {product.condition}
                                </b>

                            </div>

                            <div className="score-box">

                                <div className="score-title">
                                    Quality Score
                                </div>

                                <div className="score-bar">

                                    <div
                                        className="score-fill"
                                        style={{
                                            width: `${product.quality_score}%`
                                        }}
                                    />

                                </div>

                                <p>
                                    {product.quality_score}/100
                                </p>

                            </div>

                            <button
                                className="compare-btn"
                                onClick={() => setCompareOpen(true)}
                            >
                                <FaImages />
                                Compare Original & AI Detection
                            </button>

                        </div>

                    </div>

                    <div className="modal-sections">

                        <div className="modal-section">

                            <h3>
                                <FaExclamationTriangle />
                                Possible Defects
                            </h3>

                            {
                                defects.length === 0 ?

                                    <p>
                                        No defects detected.
                                    </p>

                                    :

                                    <ul>

                                        {
                                            defects.map((item, index) => (

                                                <li key={index}>
                                                    {item}
                                                </li>

                                            ))
                                        }

                                    </ul>
                            }

                        </div>

                        <div className="modal-section">

                            <h3>
                                <FaStar />
                                Recommendation
                            </h3>

                            <p>
                                {product.recommendation}
                            </p>

                        </div>

                        <div className="modal-section">

                            <h3>
                                <FaRobot />
                                AI Summary
                            </h3>

                            <p>
                                {product.summary}
                            </p>

                        </div>

                    </div>

                    <div className="modal-footer">

                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="download-btn"
                        >
                            <FaDownload />
                            Download PDF Report
                        </a>

                    </div>

                </div>

            </div>
        </>
    );
}

export default ProductModal;
