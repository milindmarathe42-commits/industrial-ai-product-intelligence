import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaEnvelope,
    FaLock,
    FaRobot,
    FaArrowRight,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import toast from "react-hot-toast";
import api from "../services/api";

import "../styles/Login.css";

function Login() {

    console.log("Login Component Loaded");

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post(
                "/login",
                form
            );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            toast.success(
                "Login Successful"
            );

            navigate("/dashboard");

        }
        /*-------------------*/

        catch (error) {

            if (error.response?.status === 404) {

                toast.error(
                    "User not found. Please register first."
                );

            }

            else if (error.response?.status === 401) {

                toast.error(
                    "Invalid password. Please try again."
                );

            }

            else {

                toast.error(
                    error.response?.data?.detail ||
                    "Login Failed"
                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-left">

                <div className="brand">

                    <div className="brand-icon">

                        <FaRobot />

                    </div>

                    <h1>
                        Industrial AI
                    </h1>

                    <p>
                        AI Powered Product Intelligence Platform
                    </p>

                </div>

                <div className="hero-content">

                    <h2>
                        Smart Manufacturing
                    </h2>

                    <h2>
                        Quality Inspection
                    </h2>

                    <h2>
                        Using Artificial Intelligence
                    </h2>

                    <p>
                        Detect products using YOLO, generate intelligent
                        inspection reports using Gemini AI and automate
                        industrial quality assurance.
                    </p>

                    <div className="feature-list">

                        <div>
                            ✅ AI Product Detection
                        </div>

                        <div>
                            ✅ Gemini AI Inspection
                        </div>

                        <div>
                            ✅ PDF Reports
                        </div>

                        <div>
                            ✅ Analytics Dashboard
                        </div>

                    </div>

                </div>

            </div>

            <div className="login-right">

                <form
                    className="login-card"
                    onSubmit={handleLogin}
                >

                    <h2>
                        Welcome Back
                    </h2>

                    <p>
                        Login to continue
                    </p>

                    <div className="input-group">

                        <FaEnvelope />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="input-group">

                        <FaLock />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                        <span
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >

                            {
                                showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }

                        </span>

                    </div>

                    <button
                        className="login-btn"
                        disabled={loading}
                        type="submit"
                    >

                        {
                            loading
                                ? "Signing In..."
                                :
                                <>
                                    Login
                                    <FaArrowRight />
                                </>
                        }

                    </button>

                    <div className="register-link">

                        Don't have an account?

                        <Link to="/register">
                            Register
                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default Login;