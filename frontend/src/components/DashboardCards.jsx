import { useEffect, useState } from "react";

import "../styles/DashboardCards.css";
import api from "../services/api";
import useCountUp from "../hooks/useCountUp";

function DashboardCards({ refresh }) {

    const [dashboard, setDashboard] = useState({

        total_products: 0,
        good_products: 0,
        damaged_products: 0,
        average_confidence: 0,

    });

    const fetchDashboard = async () => {

        try {

            const response = await api.get("/dashboard");

            setDashboard(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchDashboard();

    }, [refresh]);

    const totalProducts = useCountUp(
        dashboard.total_products
    );

    const goodProducts = useCountUp(
        dashboard.good_products
    );

    const damagedProducts = useCountUp(
        dashboard.damaged_products
    );

    const averageConfidence = useCountUp(
        dashboard.average_confidence
    );

    return (

        <div className="cards-container">

            <div className="card">

                <span className="trend-badge blue">

                    ▲ +12%

                </span>

                <div className="card-icon">

                    📦

                </div>

                <h3>

                    Total Products

                </h3>

                <h1>

                    {totalProducts}

                </h1>

                <p>

                    Products Stored

                </p>

            </div>

            <div className="card">

                <span className="trend-badge green">

                    ▲ +8%

                </span>

                <div className="card-icon">

                    ✅

                </div>

                <h3>

                    Good Products

                </h3>

                <h1>

                    {goodProducts}

                </h1>

                <p>

                    Passed AI Inspection

                </p>

            </div>

            <div className="card">

                <span className="trend-badge orange">

                    ▼ -2%

                </span>

                <div className="card-icon">

                    ⚠️

                </div>

                <h3>

                    Damaged Products

                </h3>

                <h1>

                    {damagedProducts}

                </h1>

                <p>

                    Need Manual Review

                </p>

            </div>

            <div className="card">

                <span className="trend-badge purple">

                    ★ AI

                </span>

                <div className="card-icon">

                    🎯

                </div>

                <h3>

                    Average Confidence

                </h3>

                <h1>

                    {averageConfidence}%

                </h1>

                <p>

                    AI Detection Accuracy

                </p>

            </div>

        </div>

    );

}

export default DashboardCards;