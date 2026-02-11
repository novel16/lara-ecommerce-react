import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [flag, setFlag] = useState(false)

     const {setToken} = useContext(AuthContext);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFlag(true)
        try {
            const response = await fetch("/api/V1/register", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            if (data.errors) {
                setErrors(data.errors);
                return;
            }
            console.log(data);
            localStorage.setItem("token", data.token)
            setToken(data.token)
            navigate("/")
        } catch (error) {
            console.error("something went wrong:", error.message);
        }finally{
            setFlag(false)
        }
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className="my-10 p-4 bg-white w-1/2 rounded-md">
                <h3 className="font-bold text-3xl text-gray-700 text-center">
                    Create an Account
                </h3>

                <form onSubmit={handleSubmit} className="p-3 mt-3">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="border border-gray-300 w-full p-2 rounded"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                        {errors?.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name?.[0]}
                            </p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="border border-gray-300 w-full p-2 rounded"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                        {errors?.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email?.[0]}
                            </p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="border border-gray-300 w-full p-2 rounded"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                        />
                        {errors?.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password?.[0]}
                            </p>
                        )}
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="border border-gray-300 w-full p-2 rounded"
                            placeholder="Enter confirm password"
                            value={formData.password_confirmation}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password_confirmation: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <button
                            type="submit"
                            className="w-full p-2 cursor-pointer bg-blue-500 rounded text-white text-md font-semibold"
                        >
                            {flag ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
