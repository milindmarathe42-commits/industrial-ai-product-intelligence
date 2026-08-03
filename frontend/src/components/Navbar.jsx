import "../styles/Navbar.css";

function Navbar(){

    return(

        <nav className="navbar">

            <div className="logo">
                Industrial AI
            </div>

            <ul className="menu">

                <li>Dashboard</li>

                <li>Upload</li>

                <li>Products</li>

                <li>Reports</li>

            </ul>

        </nav>

    )

}

export default Navbar;