import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    FaRobot,
    FaSignOutAlt,
    FaUserCircle
} from "react-icons/fa";

import "../styles/Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("dashboard");

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };

    const scrollToSection = (id) => {

    const section = document.getElementById(id);

    if (!section) return;

    const navbarHeight = 90;

    const position =
        section.offsetTop - navbarHeight;

    window.scrollTo({

        top: position,

        behavior: "smooth"

    });

};

    const menuItems = [

        {
            name: "Dashboard",
            id: "dashboard"
        },

        {
            name: "Upload",
            id: "upload"
        },

        {
            name: "Analytics",
            id: "analytics"
        },

        {
            name: "History",
            id: "products"
        },

        {
            name: "Reports",
            id: "reports"
        }

    ];
    useEffect(() => {

    const sections = menuItems.map(item => item.id);

    const handleScroll = () => {

        let current = "dashboard";

        sections.forEach((id) => {

            const section = document.getElementById(id);

            if (!section) return;

            const top = section.offsetTop - 120;

            if (window.scrollY >= top) {

                current = id;

            }

        });

        setActiveSection(current);

    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {

        window.removeEventListener("scroll", handleScroll);

    };

}, []);

    return (

        <nav className="navbar">

            <div className="logo">

                <div className="logo-icon">

                    <FaRobot />

                </div>

                <div className="logo-text">

                    <h2>

                        Industrial AI

                    </h2>

                    <p>

                        AI Powered Product Intelligence Platform

                    </p>

                </div>

            </div>

           <ul className="menu">

    {

        menuItems.map((item) => (

            <li

                key={item.id}

                className={

                    activeSection === item.id

                        ? "active"

                        : ""

                }

                onClick={() => scrollToSection(item.id)}

            >

                {item.name}

            </li>

        ))

    }

</ul>

            <div className="profile">

                <div className="profile-circle">

                    {

                        user ?

                        user.name.charAt(0).toUpperCase()

                        :

                        <FaUserCircle />

                    }

                </div>

                <div className="profile-info">

                    <span className="profile-name">

                        {

                            user ?

                            user.name

                            :

                            "Guest"

                        }

                    </span>

                    <div className="profile-status">

    <span className="online-dot"></span>

    Online

</div>

                </div>

                <button

                    className="logout-btn"

                    onClick={logout}

                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </nav>

    );

}

export default Navbar;