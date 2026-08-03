import { useState } from "react";

import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import UploadSection from "./components/UploadSection";
import ProductTable from "./components/ProductTable";
import SearchBar from "./components/SearchBar";

function App() {

    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState("");

    const refreshData = () => {
        setRefresh(!refresh);
    };

    return (
        <>
            <Navbar />

            <DashboardCards refresh={refresh} />

            <UploadSection refreshData={refreshData} />

            <SearchBar
                search={search}
                setSearch={setSearch}
            />

            <ProductTable
                refresh={refresh}
                search={search}
            />
        </>
    );
}

export default App;