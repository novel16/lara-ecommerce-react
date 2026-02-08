import { createContext, useEffect, useState } from "react";
import { data } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const getUser = async () => {
        try {
            const response = await fetch("/api/V1/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                // console.log("setuser", data)
            }
            // console.log("user:", data)
        } catch (error) {
            console.error("Something went wrong:", error.message);
        }
    };

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    const login = async (formData) => {

        try {
            const response = await fetch('/api/V1/login', {
                method: "POST",
                body: JSON.stringify(formData),
                headers:{
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json()
            // if(data.errors){
            //     setErrors(data.errors)
            // }else{
            //     localStorage.setItem('token', data.token)
            //     setToken(data.token)
            // }
            if(response.ok){
                return data
            }
            

        } catch (error) {
            console.error("Something went wrong:", error.message)
        }

    }

    const logout = async () => {
        const response = await fetch("/api/V1/user", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json()
        if(data){
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ token, setToken, user, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
}
