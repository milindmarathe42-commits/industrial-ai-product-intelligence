import {
    FaCloudUploadAlt,
    FaChartLine,
    FaRobot,
    FaFilePdf
} from "react-icons/fa";

import "../styles/HeroSection.css";

function HeroSection() {

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    return (

        <div className="hero-section">

            <div className="hero-left">

                <span className="hero-tag">

                    👋 Welcome Back

                </span>

                <h1>

                    {user?.name}

                </h1>

                <h2>

                    Industrial AI Product Intelligence Platform

                </h2>

                <p>

                    Inspect products using Artificial Intelligence,
                    generate intelligent quality reports,
                    analyze manufacturing trends,
                    and automate industrial quality assurance.

                </p>

                <div className="hero-buttons">

                    <a

                        href="#upload"

                        className="primary-btn"

                    >

                        <FaCloudUploadAlt />

                        Upload Product

                    </a>

                    <a

                        href="#reports"

                        className="secondary-btn"

                    >

                        <FaFilePdf />

                        View Reports

                    </a>

                </div>

            </div>

            <div className="hero-right">

                <div className="feature-card">

                    <FaRobot />

                    <span>

                        AI Detection

                    </span>

                </div>

                <div className="feature-card">

                    <FaChartLine />

                    <span>

                        Analytics

                    </span>

                </div>

                <div className="feature-card">

                    <FaFilePdf />

                    <span>

                        PDF Reports

                    </span>

                </div>

                <div className="feature-card">

                    <FaCloudUploadAlt />

                    <span>

                        Smart Upload

                    </span>

                </div>

            </div>

        </div>

    );

}

export default HeroSection;