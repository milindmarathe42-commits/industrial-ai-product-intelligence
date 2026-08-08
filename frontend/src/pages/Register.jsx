import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        full_name: "",

        email: "",

        password: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/register",
                form
            );

            toast.success(
                "Registration Successful"
            );

            navigate("/");

        }

        catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            const message =
                error.response?.data?.detail ||
                "Registration Failed";

            toast.error(
                message,
                {
                    duration: 5000
                }
            );

        }

    };

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"
            }}
        >

            <form
                onSubmit={handleRegister}
                style={{
                    width: "420px",
                    background: "white",
                    padding: "40px",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,.1)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >
                    Create Account
                </h1>

                <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "15px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        border: "1px solid #ddd"
                    }}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "15px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        border: "1px solid #ddd"
                    }}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "15px",
                        marginBottom: "25px",
                        borderRadius: "10px",
                        border: "1px solid #ddd"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "15px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    Register
                </button>

                <p
                    style={{
                        marginTop: "20px",
                        textAlign: "center"
                    }}
                >
                    Already have an account?{" "}

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </form>

        </div>

    );

}

export default Register;
