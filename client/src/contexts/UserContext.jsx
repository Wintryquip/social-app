import React, { createContext, useState, useEffect } from "react"
import axios from "axios"

export const UserContext = createContext({})

export const UserProvider = ({ children }) => {
    const DEFAULT_PROFILE_PIC = "/uploads/images/profile/default/default.png"
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`${baseUrl}:${port}/user/me`, { withCredentials: true })
                setUser({
                    _id: data._id,
                    login: data.login,
                    profilePic: data.profilePic || DEFAULT_PROFILE_PIC
                })
            } catch (error) {
                setUser(null)
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [baseUrl, port])

    const login = (userData) => {
        setUser({
            login: userData.login,
            profilePic: userData.profilePic || DEFAULT_PROFILE_PIC
        })
        setError(null)
    }

    const logout = async () => {
        try {
            await axios.post(`${baseUrl}:${port}/user/logout`,
                {}, { withCredentials: true })
            setUser(null)
            setError(null)
            window.location.href = '/'
            window.location.reload()
        } catch (error) {
            setError("Error logging out.")
            console.log("Logout failure:", error)
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading, error, DEFAULT_PROFILE_PIC }}>
            {children}
        </UserContext.Provider>
    )
}