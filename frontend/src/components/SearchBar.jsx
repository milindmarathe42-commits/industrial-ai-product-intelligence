import "../styles/SearchBar.css";

function SearchBar({ search, setSearch }) {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="🔍 Search Product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />
        </div>
    );
}

export default SearchBar;