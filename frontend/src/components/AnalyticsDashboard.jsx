import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

import "../styles/AnalyticsDashboard.css";

function AnalyticsDashboard({ products }) {

    if (!products || products.length === 0) return null;

    const totalProducts = products.length;

    const averageConfidence = Math.round(

        products.reduce(

            (sum, item) => sum + item.confidence,

            0

        ) / totalProducts * 100

    );

    const needsInspection = products.filter(

        item => item.confidence < 0.5

    ).length;

    const passedInspection = totalProducts - needsInspection;

    /* ==========================================
       Manufacturing Health Score
    ========================================== */

    const healthScore = Math.round(

        ((passedInspection / totalProducts) * 60) +

        ((averageConfidence / 100) * 40)

    );

    const getHealthStatus = () => {

        if (healthScore >= 90)

            return {

                title: "Excellent",

                color: "#22C55E",

                message:
                    "Manufacturing quality is excellent. AI inspection indicates a stable production process."

            };

        if (healthScore >= 75)

            return {

                title: "Good",

                color: "#2563EB",

                message:
                    "Production quality is good with only minor issues detected."

            };

        if (healthScore >= 50)

            return {

                title: "Average",

                color: "#F59E0B",

                message:
                    "Some products require manual inspection. Monitor production carefully."

            };

        return {

            title: "Critical",

            color: "#EF4444",

            message:
                "High number of inspection failures detected. Immediate quality review is recommended."

        };

    };

    const health = getHealthStatus();

    const productCount = {};

    products.forEach(item => {

        productCount[item.product_name] =

            (productCount[item.product_name] || 0) + 1;

    });

    const topProduct = Object.keys(productCount).reduce(

        (a, b) =>

            productCount[a] > productCount[b]

                ? a

                : b

    );

    const pieData = Object.keys(productCount).map(

        key => ({

            name: key,

            value: productCount[key]

        })

    );

    const barData = products.map(

        item => ({

            id: item.id,

            score: Math.round(item.confidence * 100)

        })

    );

    const COLORS = [

        "#2563EB",

        "#22C55E",

        "#F59E0B",

        "#EF4444",

        "#7C3AED",

        "#06B6D4"

    ];

    return (

        <div className="analytics-container">

            <h2>

                📊 Manufacturing Analytics Dashboard

            </h2>

            <div className="health-card">

                <div className="health-left">

                    <span className="health-title">

                        🏭 Overall Manufacturing Health

                    </span>

                    <h1
                        style={{
                            color: health.color
                        }}
                    >
                        {healthScore}%
                    </h1>

                    <h2
                        style={{
                            color: health.color,
                            marginTop: "-10px",
                            marginBottom: "15px",
                            fontSize: "28px"
                        }}
                    >
                        {health.title}
                    </h2>

                    <p>

                        {health.message}

                    </p>

                </div>

                <div className="health-right">

                    <div
                        className="health-circle"
                        style={{
                            borderColor: health.color,
                            color: health.color
                        }}
                    >

                        {healthScore}%

                    </div>

                </div>

            </div>

            <div className="stats-grid">

                <div className="stat-card">

                    <h3>Total Products</h3>

                    <h1>{totalProducts}</h1>

                </div>

                <div className="stat-card">

                    <h3>Average Confidence</h3>

                    <h1>{averageConfidence}%</h1>

                </div>
                                <div className="stat-card">

                    <h3>Passed Inspection</h3>

                    <h1>{passedInspection}</h1>

                </div>

                <div className="stat-card">

                    <h3>Top Product</h3>

                    <h1>{topProduct}</h1>

                </div>

            </div>

            <div className="charts-grid">

                <div className="chart-card">

                    <h3>

                        📦 Product Distribution

                    </h3>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <PieChart>

                            <Pie

                                data={pieData}

                                dataKey="value"

                                nameKey="name"

                                outerRadius={110}

                                label

                                isAnimationActive={true}

                                animationBegin={0}

                                animationDuration={1500}

                                animationEasing="ease-out"

                            >

                                {

                                    pieData.map(

                                        (entry, index) => (

                                            <Cell

                                                key={index}

                                                fill={
                                                    COLORS[index % COLORS.length]
                                                }

                                            />

                                        )

                                    )

                                }

                            </Pie>

                            <Tooltip

                                cursor={{
                                    fill: "rgba(37,99,235,.08)"
                                }}

                                contentStyle={{
                                    borderRadius: "14px",
                                    border: "none",
                                    boxShadow:
                                        "0 10px 25px rgba(0,0,0,.12)"
                                }}

                            />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                <div className="chart-card">

                    <h3>

                        🎯 AI Detection Confidence

                    </h3>

                    <ResponsiveContainer

                        width="100%"

                        height={320}

                    >

                        <BarChart

                            data={barData}

                        >

                            <CartesianGrid

                                strokeDasharray="4 4"

                                stroke="#E2E8F0"

                            />

                            <XAxis

                                dataKey="id"

                            />

                            <YAxis />

                            <Tooltip

                                cursor={{
                                    fill: "rgba(37,99,235,.08)"
                                }}

                                contentStyle={{
                                    borderRadius: "14px",
                                    border: "none",
                                    boxShadow:
                                        "0 10px 25px rgba(0,0,0,.12)"
                                }}

                            />

                            <Legend />

                            <Bar

                                dataKey="score"

                                fill="#2563EB"

                                radius={[8, 8, 0, 0]}

                                animationBegin={300}

                                animationDuration={1800}

                                animationEasing="ease-out"

                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

    );

}

export default AnalyticsDashboard;