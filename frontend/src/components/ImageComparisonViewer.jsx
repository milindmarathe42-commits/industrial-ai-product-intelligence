import { useState } from "react";

import {

    FaTimes,

    FaExchangeAlt

} from "react-icons/fa";

import "../styles/ImageComparisonViewer.css";

function ImageComparisonViewer({

    original,

    detected,

    onClose

}) {

    const [slider, setSlider] = useState(50);

    return (

        <div className="viewer-overlay">

            <button

                className="viewer-close"

                onClick={onClose}

            >

                <FaTimes />

            </button>

            <h2>

                <FaExchangeAlt />

                AI Image Comparison

            </h2>

            <div className="viewer-wrapper">

                <img

                    src={original}

                    alt="Original"

                    className="viewer-image"

                />

                <div

                    className="viewer-overlay-image"

                    style={{

                        width: `${slider}%`

                    }}

                >

                    <img

                        src={detected}

                        alt="AI"

                        className="viewer-image"

                    />

                </div>

                <div

                    className="viewer-divider"

                    style={{

                        left: `${slider}%`

                    }}

                >

                    <div className="viewer-handle">

                        ⇆

                    </div>

                </div>

                <input

                    type="range"

                    min="0"

                    max="100"

                    value={slider}

                    onChange={(e)=>

                        setSlider(e.target.value)

                    }

                    className="viewer-slider"

                />

            </div>

            <div className="viewer-labels">

                <span>

                    📷 Original

                </span>

                <span>

                    🤖 AI Detection

                </span>

            </div>

        </div>

    );

}

export default ImageComparisonViewer;