import React, { createContext, useState } from "react"

export const UserContext = createContext({})

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token")
        const login = localStorage.getItem("login")
        const profilePic = localStorage.getItem("profilePic")
        return token ? { token, login, profilePic } : null
    })

    const login = ({ token, login, profilePic }) => {
        localStorage.setItem("token", token)
        localStorage.setItem("login", login)
        localStorage.setItem("profilePic", profilePic || "")
        setUser({ token, login, profilePic })
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("login")
        localStorage.removeItem("profilePic")
        setUser(null)
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}
