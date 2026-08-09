import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    FaRobot,
    FaSignOutAlt,
    FaUserCircle,
    FaBars,
    FaTimes
} from "react-icons/fa";

import "../styles/Navbar.css";


function Navbar() {

    const navigate = useNavigate();

    const [activeSection, setActiveSection] =
        useState("dashboard");

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

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


    const scrollToSection = (id) => {

        const section =
            document.getElementById(id);

        if (!section) return;

        const navbarHeight = 85;

        const position =
            section.offsetTop - navbarHeight;

        window.scrollTo({

            top: position,

            behavior: "smooth"

        });


        setMobileMenuOpen(false);

    };


    useEffect(() => {

        const sections =
            menuItems.map(
                item => item.id
            );


        const handleScroll = () => {

            let current = "dashboard";


            sections.forEach((id) => {

                const section =
                    document.getElementById(id);

                if (!section) return;


                const top =
                    section.offsetTop - 120;


                if (window.scrollY >= top) {

                    current = id;

                }

            });


            setActiveSection(current);

        };


        window.addEventListener(
            "scroll",
            handleScroll
        );


        handleScroll();


        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, []);


    return (

        <nav className="navbar">


            {/* LOGO */}

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


            {/* DESKTOP MENU */}

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

                            onClick={() =>
                                scrollToSection(
                                    item.id
                                )
                            }

                        >

                            {item.name}

                        </li>

                    ))

                }

            </ul>


            {/* PROFILE */}

            <div className="profile">


                <div className="profile-circle">

                    {

                        user ?

                        user.name
                            .charAt(0)
                            .toUpperCase()

                        :

                        <FaUserCircle />

                    }

                </div>


                <div className="profile-info">

                    <span className="profile-name">

                        {

                            user
                                ? user.name
                                : "Guest"

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


                {/* MOBILE MENU BUTTON */}

                <button

                    className="mobile-menu-btn"

                    onClick={() =>
                        setMobileMenuOpen(
                            !mobileMenuOpen
                        )
                    }

                    aria-label="Toggle menu"

                >

                    {

                        mobileMenuOpen

                            ? <FaTimes />

                            : <FaBars />

                    }

                </button>

            </div>


            {/* MOBILE MENU */}

            <div

                className={`mobile-menu ${
                    mobileMenuOpen
                        ? "mobile-menu-open"
                        : ""
                }`}

            >

                <div className="mobile-menu-header">

                    <div>

                        <span className="mobile-menu-title">

                            Navigation

                        </span>

                        <span className="mobile-menu-subtitle">

                            Industrial AI Platform

                        </span>

                    </div>

                </div>


                <div className="mobile-menu-items">

                    {

                        menuItems.map((item) => (

                            <button

                                key={item.id}

                                className={

                                    activeSection === item.id
                                        ? "mobile-menu-item active-mobile"
                                        : "mobile-menu-item"

                                }

                                onClick={() =>
                                    scrollToSection(
                                        item.id
                                    )
                                }

                            >

                                <span>
                                    {item.name}
                                </span>

                                {

                                    activeSection ===
                                    item.id &&

                                    <span className="mobile-active-dot">
                                        ●
                                    </span>

                                }

                            </button>

                        ))

                    }

                </div>


                <div className="mobile-user">

                    <div className="mobile-user-avatar">

                        {

                            user ?

                            user.name
                                .charAt(0)
                                .toUpperCase()

                            :

                            <FaUserCircle />

                        }

                    </div>


                    <div className="mobile-user-info">

                        <strong>

                            {

                                user
                                    ? user.name
                                    : "Guest"

                            }

                        </strong>

                        <span>

                            <span className="online-dot"></span>

                            Online

                        </span>

                    </div>

                </div>


                <button

                    className="mobile-logout"

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
