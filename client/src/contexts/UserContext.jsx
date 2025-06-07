import React, { createContext, useState } from "react"

export const UserContext = createContext({})

export const UserProvider = ({ children }) => {
    const DEFAULT_PROFILE_PIC = "/uploads/images/profile/default/default.png"
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token")
        const login = localStorage.getItem("login")
        const profilePic = localStorage.getItem("profilePic") || DEFAULT_PROFILE_PIC
        return token ? { token, login, profilePic } : null
    })

    const login = ({ token, login, profilePic }) => {
        const pic = profilePic || DEFAULT_PROFILE_PIC
        localStorage.setItem("token", token)
        localStorage.setItem("login", login)
        localStorage.setItem("profilePic", pic)
        setUser({ token, login, profilePic: pic })
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("login")
        localStorage.removeItem("profilePic")
        setUser(null)
    }

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, DEFAULT_PROFILE_PIC }}>
            {children}
        </UserContext.Provider>
    )
}