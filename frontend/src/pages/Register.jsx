import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        full_name: "",

        email: "",

        password: ""

    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleRegister = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post(
                "/register",
                form
            );

            await Swal.fire({

                icon: "success",

                title: "Registration Successful",

                text: response.data?.message ||
                    "Your account has been created successfully.",

                confirmButtonColor: "#2563eb"

            });

            navigate("/");

        }

        catch (error) {

            console.log(
                "Registration Error:",
                error
            );

            const status = error.response?.status;

            const message =
                error.response?.data?.detail ||
                "Registration Failed";

            if (status === 400) {

                await Swal.fire({

                    icon: "error",

                    title: "Email Already Registered",

                    text: "This email is already registered. Please login instead.",

                    confirmButtonText: "Go to Login",

                    confirmButtonColor: "#2563eb"

                });

            }

            else {

                await Swal.fire({

                    icon: "error",

                    title: "Registration Failed",

                    text: message,

                    confirmButtonColor: "#2563eb"

                });

            }

        }

        finally {

            setLoading(false);

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
                        border: "1px solid #ddd",
                        boxSizing: "border-box"
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
                        border: "1px solid #ddd",
                        boxSizing: "border-box"
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
                        border: "1px solid #ddd",
                        boxSizing: "border-box"
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "15px",
                        background: loading
                            ? "#93c5fd"
                            : "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "16px",
                        cursor: loading
                            ? "not-allowed"
                            : "pointer"
                    }}
                >

                    {loading
                        ? "Registering..."
                        : "Register"
                    }

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
