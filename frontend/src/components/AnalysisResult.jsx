import "../styles/AnalysisResult.css";

import {
    FaRobot,
    FaCheckCircle,
    FaBoxOpen,
    FaIndustry,
    FaStar,
    FaClipboardCheck,
    FaExclamationTriangle
} from "react-icons/fa";

function AnalysisResult({ result }) {

    if (!result) return null;

    const ai = result.ai_report;

    const radius = 55;

    const circumference = 2 * Math.PI * radius;

    const offset =
        circumference -
        (ai.quality_score / 100) * circumference;

    let gaugeColor = "#22c55e";

    if (ai.quality_score < 70)
        gaugeColor = "#f59e0b";

    if (ai.quality_score < 40)
        gaugeColor = "#ef4444";

    const getQualityLabel = () => {

        if (ai.quality_score >= 85)
            return "Excellent";

        if (ai.quality_score >= 65)
            return "Good";

        if (ai.quality_score >= 40)
            return "Average";

        return "Poor";

    };

    const getConditionColor = () => {

        if (ai.quality_score >= 85)
            return "#22c55e";

        if (ai.quality_score >= 65)
            return "#3b82f6";

        if (ai.quality_score >= 40)
            return "#f59e0b";

        return "#ef4444";

    };
    /* ==========================================
   Explainable AI (XAI)
========================================== */

    const primaryDetection =

        result.detections.length > 0

            ? result.detections.reduce(

                (best, current) =>

                    current.confidence > best.confidence

                        ? current

                        : best

            )

            : null;

    const inspectionResult =

        ai.quality_score >= 65

            ? "PASSED"

            : "REQUIRES MANUAL INSPECTION";

    const reliability =

        ai.quality_score >= 90

            ? {

                title: "High",

                color: "#22C55E"

            }

            : ai.quality_score >= 75

                ? {

                    title: "Medium",

                    color: "#2563EB"

                }

                : {

                    title: "Low",

                    color: "#EF4444"

                };

    const explanations = [

    {
        icon: "🎯",
        text: `YOLO detected "${ai.product_name}" with ${
            primaryDetection
                ? Math.round(primaryDetection.confidence * 100)
                : ai.quality_score
        }% confidence.`
    },

    {
        icon: "📦",
        text: `The detected product belongs to the "${ai.category}" category.`
    },

    {
        icon: "🏭",
        text: `Brand identified as "${ai.brand}".`
    },

    {
        icon: "⭐",
        text: `Overall AI Quality Score is ${ai.quality_score}%.`
    },

    {
        icon: "✅",
        text: `Final inspection classified the product as "${ai.condition}".`
    },

    {
        icon: "📋",
        text: `Inspection result: ${inspectionResult}.`
    }

];

    return (

        <div className="analysis-container">

            <h2>

                <FaRobot className="title-icon" />

                AI Product Inspection Report

            </h2>

            <div className="inspection-status">

                <div className="status-left">

                    <span className="status-dot"></span>

                    Inspection Completed Successfully

                </div>

                <div className="status-right">

                    AI Powered Quality Inspection

                </div>

            </div>
            <div className="timeline-card">

                <h3>

                    🤖 AI Inspection Pipeline

                </h3>

                <div className="timeline">

                    <div className="timeline-step completed">

                        <div className="timeline-icon">

                            📷

                        </div>

                        <p>

                            Image Uploaded

                        </p>

                    </div>

                    <div className="timeline-line"></div>

                    <div className="timeline-step completed">

                        <div className="timeline-icon">

                            🧠

                        </div>

                        <p>

                            YOLO Detection

                        </p>

                    </div>

                    <div className="timeline-line"></div>

                    <div className="timeline-step completed">

                        <div className="timeline-icon">

                            🤖

                        </div>

                        <p>

                            Gemini AI Analysis

                        </p>

                    </div>

                    <div className="timeline-line"></div>

                    <div className="timeline-step completed">

                        <div className="timeline-icon">

                            📄

                        </div>

                        <p>

                            PDF Generated

                        </p>

                    </div>

                    <div className="timeline-line"></div>

                    <div className="timeline-step completed">

                        <div className="timeline-icon">

                            ✅

                        </div>

                        <p>

                            Inspection Complete

                        </p>

                    </div>

                </div>

            </div>

            <div className="result-card">

                <div className="result-left">

                    <div className="quality-gauge">

                        <svg

                            width="170"

                            height="170"

                        >

                            <circle

                                cx="85"

                                cy="85"

                                r={radius}

                                stroke="#E5E7EB"

                                strokeWidth="12"

                                fill="none"

                            />

                            <circle

                                cx="85"

                                cy="85"

                                r={radius}

                                stroke={gaugeColor}

                                strokeWidth="12"

                                fill="none"

                                strokeLinecap="round"

                                strokeDasharray={circumference}

                                strokeDashoffset={offset}

                                transform="rotate(-90 85 85)"

                            />

                        </svg>

                        <div className="gauge-text">

                            <h1>

                                {ai.quality_score}%

                            </h1>

                            <span>

                                {getQualityLabel()}

                            </span>

                        </div>

                    </div>

                    <div className="info-box">

                        <h3>

                            <FaBoxOpen />

                            Product

                        </h3>

                        <h1>

                            {ai.product_name}

                        </h1>

                    </div>

                    <div className="info-box">

                        <h3>

                            <FaIndustry />

                            Brand

                        </h3>

                        <p>

                            {ai.brand}

                        </p>

                    </div>

                    <div className="info-box">

                        <h3>

                            Category

                        </h3>

                        <p>

                            {ai.category}

                        </p>

                    </div>

                    <div className="info-box">

                        <h3>

                            Condition

                        </h3>

                        <span

                            className="condition-badge"

                            style={{

                                background: getConditionColor(),

                                color: "white"

                            }}

                        >

                            <FaCheckCircle />

                            {ai.condition}

                        </span>

                    </div>

                </div>
                <div className="result-right">

                    <div className="section">

                        <h3>

                            <FaClipboardCheck />

                            Detected Objects

                        </h3>

                        {

                            result.detections.map((item, index) => (

                                <div

                                    className="detect-item"

                                    key={index}

                                >

                                    <div className="detect-left">

                                        📦 {item.object}

                                    </div>

                                    <div className="detect-right">

                                        <div
                                            style={{
                                                width: "150px",
                                                height: "8px",
                                                background: "#E5E7EB",
                                                borderRadius: "20px",
                                                overflow: "hidden",
                                                marginBottom: "8px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width: `${item.confidence * 100}%`,
                                                    height: "100%",
                                                    background: gaugeColor,
                                                    transition: "0.8s"
                                                }}
                                            />

                                        </div>

                                        <strong>

                                            {(item.confidence * 100).toFixed(0)}%

                                        </strong>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                    <div className="section">

                        <h3>

                            <FaExclamationTriangle />

                            Possible Defects

                        </h3>

                        <ul>

                            {

                                ai.possible_defects.map((item, index) => (

                                    <li key={index}>

                                        ⚠ {item}

                                    </li>

                                ))

                            }

                        </ul>

                    </div>

                    <div className="section">

                        <h3>

                            <FaStar />

                            Recommendation

                        </h3>

                        <div

                            style={{

                                background: "#ECFDF5",

                                color: "#15803D",

                                padding: "18px",

                                borderRadius: "14px",

                                border: "1px solid #BBF7D0",

                                fontWeight: "700",

                                fontSize: "16px"

                            }}

                        >

                            ✅ {ai.recommendation}

                        </div>

                    </div>

                    <div className="section">

                        <h3>

                            <FaRobot />

                            AI Summary

                        </h3>

                        <div

                            style={{

                                background: "#F8FAFC",

                                border: "1px solid #E2E8F0",

                                borderRadius: "14px",

                                padding: "20px",

                                lineHeight: "1.8",

                                color: "#334155"

                            }}

                        >

                            {ai.summary}

                        </div>

                    </div>
                    <div className="section">

                        <h3>

                            🧠 Explainable AI (XAI)

                        </h3>

                        <div className="xai-card">

                            {

                                explanations.map((item, index) => (

                                    <div

                                        className="xai-item"

                                        key={index}

                                    >

                                        <div className="xai-icon">

                                            {item.icon}

                                        </div>

                                        <div className="xai-text">

                                            {item.text}

                                        </div>

                                    </div>

                                ))

                            }

                            <div className="xai-confidence">

                                <h4>

                                    🤖 AI Decision Reliability

                                </h4>

                                <div className="xai-bar">

                                    <div

                                        className="xai-fill"

                                        style={{

                                            width: `${ai.quality_score}%`,

                                            background: reliability.color

                                        }}

                                    >

                                    </div>

                                </div>

                                <span

                                    style={{

                                        color: reliability.color,

                                        fontWeight: "700"

                                    }}

                                >

                                    {reliability.title} Reliability

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AnalysisResult;