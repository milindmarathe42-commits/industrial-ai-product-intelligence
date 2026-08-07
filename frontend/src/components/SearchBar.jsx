import { FaSearch, FaFilter } from "react-icons/fa";

import "../styles/SearchBar.css";

function SearchBar({ search, setSearch }) {

    return (

        <div className="search-wrapper">

            <div className="search-header">

                <div>

                    <h2>

                        📦 Product Inspection History

                    </h2>

                    <p>

                        Browse, search and manage all AI inspection records.

                    </p>

                </div>

                <button className="filter-btn">

                    <FaFilter />

                    Filters

                </button>

            </div>

            <div className="search-container">

                <FaSearch className="search-icon" />

                <input

                    type="text"

                    placeholder="Search by product name..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    className="search-input"

                />

            </div>

        </div>

    );

}

export default SearchBar;