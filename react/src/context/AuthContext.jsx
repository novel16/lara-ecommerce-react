import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [storedToken, setStoredToken] = useState(
        localStorage.getItem("token") || null,
    );
    const [authLoading, setAuthLoading] = useState(Boolean(storedToken));

    const setToken = (nextToken) => {
        setStoredToken(nextToken);
        setAuthLoading(Boolean(nextToken));

        if (!nextToken) {
            localStorage.removeItem("token");
            setUser(null);
            return;
        }

        localStorage.setItem("token", nextToken);
    };

    useEffect(() => {
        if (!storedToken) {
            return;
        }

        let isMounted = true;

        fetch("/api/V1/user", {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        })
            .then(async (response) => {
                const data = await response.json();

                if (!isMounted) {
                    return;
                }

                if (!response.ok) {
                    setToken(null);
                    return;
                }

                setUser(data);
            })
            .catch((error) => {
                if (!isMounted) {
                    return;
                }

                console.error("Something went wrong:", error.message);
                setToken(null);
            })
            .finally(() => {
                if (isMounted) {
                    setAuthLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [storedToken]);

    const login = async (formData) => {
        try {
            const response = await fetch("/api/V1/login", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Something went wrong:", error.message);
        }
    };

    const logout = async () => {
        try {
            if (storedToken) {
                await fetch("/api/V1/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
            }
        } catch (error) {
            console.error("Something went wrong:", error.message);
        } finally {
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token: storedToken,
                setToken,
                user,
                authLoading,
                logout,
                login,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
