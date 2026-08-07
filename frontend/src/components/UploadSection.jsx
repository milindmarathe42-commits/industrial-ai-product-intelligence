import UploadCard from "./UploadCard";
import AnalysisResult from "./AnalysisResult";
import "../styles/UploadSection.css";

function UploadSection({
    refreshData,
    result,
    setResult
}) {

    return (

        <div className="upload-layout">

            <UploadCard
                refreshData={refreshData}
                setResult={setResult}
            />

            <AnalysisResult
                result={result}
            />

        </div>

    );

}

export default UploadSection;