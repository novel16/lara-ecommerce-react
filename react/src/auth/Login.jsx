import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { data, useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
      email: "",
      password: ""
    })
    const { login , setToken} = useContext(AuthContext)
    const [errors, setErrors] = useState({})
    const [flag, setFlag] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
      e.preventDefault()
      setFlag(true)
      try {
        const logData = await login(formData)
        if(logData.errors){
          setErrors(logData.errors)
          console.log(logData)
          return
        }
        console.log(logData)
        localStorage.setItem('token', logData.token)
        setToken(logData.token)
        navigate("/")
      } catch (error) {
        console.error("Something went wrong:", error.message)
      }finally{
        setFlag(false)
      }

    }

    return (
        <div className="w-full flex justify-center items-center">
            <div className="my-10 p-4 bg-white w-1/2 rounded-md">
                <h3 className="font-bold text-3xl text-gray-700 text-center">
                    Login you Account
                </h3>

                <form onSubmit={handleSubmit} className="p-3 mt-3">
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
                        <button
                            type="submit"
                            className="w-full p-2 cursor-pointer bg-blue-500 rounded text-white text-md font-semibold"
                        >
                            {flag ? "Logging in..." : "login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
