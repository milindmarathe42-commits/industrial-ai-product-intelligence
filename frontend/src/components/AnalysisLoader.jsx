import "../styles/AnalysisLoader.css";

function AnalysisLoader() {

    return (

        <div className="loader-overlay">

            <div className="loader-card">

                <div className="loader-robot">

                    🤖

                </div>

                <h2>

                    Industrial AI

                </h2>

                <p>

                    Analyzing Product...

                </p>

                <div className="loader-bar">

                    <div className="loader-progress"></div>

                </div>

                <div className="loader-steps">

                    <div>✅ Upload Complete</div>

                    <div>🔍 YOLO Object Detection</div>

                    <div>🧠 Gemini AI Inspection</div>

                    <div>📄 Generating PDF Report</div>

                    <div>💾 Saving Database Record</div>

                </div>

            </div>

        </div>

    );

}

export default AnalysisLoader;