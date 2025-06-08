import React, { createContext, useState, useEffect } from "react"
import axios from "axios"

export const UserContext = createContext({})

export const UserProvider = ({ children }) => {
    const DEFAULT_PROFILE_PIC = "/uploads/images/profile/default/default.png"
    const [user, setUser] = useState(null)
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
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading, DEFAULT_PROFILE_PIC }}>
            {children}
        </UserContext.Provider>
    )
}