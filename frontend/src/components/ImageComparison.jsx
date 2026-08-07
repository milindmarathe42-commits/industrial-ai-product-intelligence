import { useState } from "react";

import "../styles/ImageComparison.css";

function ImageComparison({

    originalImage,

    aiImage

}) {

    const [position, setPosition] = useState(50);

    return (

        <div className="comparison-container">

            <div className="comparison-wrapper">

                {/* Original */}

                <img

                    src={originalImage}

                    alt="Original"

                    className="comparison-image"

                />

                {/* AI Image */}

                <div

                    className="comparison-overlay"

                    style={{

                        width: `${position}%`

                    }}

                >

                    <img

                        src={aiImage}

                        alt="AI Detection"

                        className="comparison-image"

                    />

                </div>

                {/* Divider */}

                <div

                    className="comparison-divider"

                    style={{

                        left: `${position}%`

                    }}

                >

                    <div className="comparison-handle">

                        ⇆

                    </div>

                </div>

                {/* Slider */}

                <input

                    type="range"

                    min="0"

                    max="100"

                    value={position}

                    onChange={(e) =>

                        setPosition(e.target.value)

                    }

                    className="comparison-slider"

                />

            </div>

            <div className="comparison-labels">

                <span>

                    📷 Original Image

                </span>

                <span>

                    🤖 AI Detection

                </span>

            </div>

        </div>

    );

}

export default ImageComparison;