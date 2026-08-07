import {
    FaFilePdf,
    FaDownload,
    FaCheckCircle,
    FaChartBar,
    FaRobot,
    FaClipboardCheck
} from "react-icons/fa";

import "../styles/PdfReportCard.css";

function PdfReportCard({ result }) {

    if (!result) return null;

    return (

        <div className="pdf-card">

            <div className="pdf-left">

                <div className="pdf-icon">

                    <FaFilePdf />

                </div>

                <div>

                    <h2>

                        AI Inspection Report Generated

                    </h2>

                    <p>

                        Your inspection report has been successfully generated
                        and is ready for viewing or downloading.

                    </p>

                    <div className="pdf-features">

                        <div>

                            <FaCheckCircle />

                            Product Information

                        </div>

                        <div>

                            <FaRobot />

                            AI Inspection

                        </div>

                        <div>

                            <FaChartBar />

                            Quality Analysis

                        </div>

                        <div>

                            <FaClipboardCheck />

                            Recommendations

                        </div>

                    </div>

                </div>

            </div>

            <div className="pdf-right">

                <a

                    href={`http://127.0.0.1:8000/${result.pdf_report}`}

                    target="_blank"

                    rel="noreferrer"

                    className="pdf-btn"

                >

                    <FaDownload />

                    Open PDF Report

                </a>

            </div>

        </div>

    );

}

export default PdfReportCard;