import "../styles/AnalysisResult.css";

function AnalysisResult({ result }) {

    if (!result) return null;

    return (
        <div className="analysis-container">

            <h2>AI Analysis Result</h2>

            <div className="result-card">

                <h3>Product Details</h3>

                <p>
                    <strong>Product :</strong>{" "}
                    {result.product_analysis.product}
                </p>

                <p>
                    <strong>Confidence :</strong>{" "}
                    {result.product_analysis.confidence}
                </p>

                <p>
                    <strong>Database ID :</strong>{" "}
                    {result.database_id}
                </p>

                <h3>Detected Objects</h3>

                <ul>

                    {result.detections.map((item, index) => (

                        <li key={index}>
                            {item.object} ({item.confidence})
                        </li>

                    ))}

                </ul>

            </div>

        </div>
    );
}

export default AnalysisResult;