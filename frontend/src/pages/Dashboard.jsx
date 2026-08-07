import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import DashboardCards from "../components/DashboardCards";
import UploadSection from "../components/UploadSection";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import PdfReportCard from "../components/PdfReportCard";

import { Toaster } from "react-hot-toast";

function Dashboard() {

    const [refresh, setRefresh] = useState(false);

    const [result, setResult] = useState(null);

    const [search, setSearch] = useState("");

    const [products, setProducts] = useState([]);

    const refreshData = () => {

        setRefresh(!refresh);

    };

    useEffect(() => {

        fetchProducts();

    }, [refresh, search]);

    const fetchProducts = async () => {

        try {

            let response;

            if (!search || search.trim() === "") {

                response = await api.get("/products");

            }

            else {

                response = await api.get(`/products/search/${search}`);

            }

            setProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <>

            <Toaster position="top-right" />

            <Navbar />

            <HeroSection />

            <section id="dashboard">

                <DashboardCards
                    refresh={refresh}
                />

            </section>

            <section id="upload">

                <UploadSection
                    refreshData={refreshData}
                    result={result}
                    setResult={setResult}
                />

            </section>

            <section id="analytics">

                <AnalyticsDashboard
                    products={products}
                />

            </section>

            <section id="products">

                <SearchBar
                    search={search}
                    setSearch={setSearch}
                />

                <ProductTable
                    products={products}
                    refreshData={refreshData}
                />

            </section>

            <section id="reports">

                <PdfReportCard
                    result={result}
                />

            </section>

        </>

    );

}

export default Dashboard;