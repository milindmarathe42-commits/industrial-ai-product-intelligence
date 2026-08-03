import { useEffect, useState } from "react";
import "../styles/DashboardCards.css";
import api from "../services/api";

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

        } catch (error) {

            console.log("Dashboard Error:", error);

        }

    };

    useEffect(() => {

        fetchDashboard();

    }, [refresh]);

    return (

        <div className="cards-container">

            <div className="card">
                <h3>Total Products</h3>
                <h1>{dashboard.total_products}</h1>
            </div>

            <div className="card">
                <h3>Good Products</h3>
                <h1>{dashboard.good_products}</h1>
            </div>

            <div className="card">
                <h3>Damaged Products</h3>
                <h1>{dashboard.damaged_products}</h1>
            </div>

            <div className="card">
                <h3>Average Confidence</h3>
                <h1>{dashboard.average_confidence}%</h1>
            </div>

        </div>

    );

}

export default DashboardCards;