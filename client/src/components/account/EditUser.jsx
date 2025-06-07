import React, {useContext, useEffect, useState} from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import {UserContext} from "../../contexts/UserContext";

// TODO update navbar profile picture after submit
const EditUser = () => {
    const baseUrl = process.env.REACT_APP_API_URL + ":" + process.env.REACT_APP_API_PORT
    const apiUrl = `${baseUrl}/user`

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        login: "",
        email: "",
        bio: "",
        profilePic: null,
    })
    const [profilePicFile, setProfilePicFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const { user, logout, setUser, DEFAULT_PROFILE_PIC } = useContext(UserContext)

    useEffect(() => {
        if (!user?.token || !user?.login)
            return
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = user?.token
                const login = user?.login

                const res = await axios.get(`${apiUrl}/profile/${login}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const fetchedUser = res.data.user

                setUserData({
                    firstName: fetchedUser.firstName || "",
                    lastName: fetchedUser.lastName || "",
                    login: fetchedUser.login || "",
                    email: fetchedUser.email || "",
                    bio: fetchedUser.bio || "",
                    profilePic: fetchedUser.profilePic || null,
                })

                if (user.profilePic) {
                    localStorage.setItem("profilePic", user.profilePic)
                } else {
                    localStorage.removeItem("profilePic")
                }

            } catch {
                console.error("Fetch user data error:", error)
                setError("Error fetching user data.")
            } finally {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFileChange = (e) => {
        setProfilePicFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setError("")
        setLoading(true)
        try {
            const token = user?.token

            const dataToSend = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                login: userData.login,
                email: userData.email,
                bio: userData.bio,
            }

            if (profilePicFile) {
                const formData = new FormData()
                Object.entries(dataToSend).forEach(([key, value]) => {
                    formData.append(key, value)
                })
                formData.append("image", profilePicFile)
                await axios.patch(`${apiUrl}/edit`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                })

            } else {
                await axios.patch(`${apiUrl}/edit`, dataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            }
            setMessage("Profile updated successfully!")
            setProfilePicFile(null)
        } catch (err) {
            console.error("Update error:", err.response?.data || err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "An error occurred while updating the profile."
            )
        } finally {
            setLoading(false)
        }
    }


    const handleDeleteProfilePic = async () => {
        localStorage.removeItem("profilePic")
        setUser(prevUser => ({
            ...prevUser,
            profilePic: DEFAULT_PROFILE_PIC
        }));
        setError("")
        setMessage("")
        setLoading(true)
        try {
            const token = user?.token
            await axios.patch(
                `${apiUrl}/picture`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            setUserData((prev) => ({ ...prev, profilePic: null }))
            setMessage("Profile picture deleted.")
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting profile picture.")
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Are you sure you want to delete your account?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete my account!',
            cancelButtonText: 'Cancel',
        })

        if (result.isConfirmed) {
            setError("")
            setMessage("")
            setLoading(true)
            try {
                const token = user?.token
                await axios.delete(`${apiUrl}/delete`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setMessage("Account deleted. Logging out...")
                setTimeout(() => {
                    logout()
                    window.location.href = "/"
                }, 2000)
            } catch (err) {
                setError(err.response?.data?.message || "Error deleting account.")
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4 text-center">Edit Profile</h2>

            {loading && (
                <div className="alert alert-info text-center" role="alert">
                    Loading...
                </div>
            )}
            {message && (
                <div className="alert alert-success text-center" role="alert">
                    {message}
                </div>
            )}
            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="login" className="form-label">
                        Username <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="login"
                        name="login"
                        value={userData.login}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="bio" className="form-label">
                        Bio
                    </label>
                    <textarea
                        className="form-control"
                        id="bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleChange}
                        placeholder="Biography"
                        maxLength={1000}
                        rows={4}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label d-block">Profile Picture</label>

                    {userData.profilePic ? (
                        <div className="mb-2">
                            <img
                                src={`${baseUrl}${userData.profilePic}`}
                                alt="Profile"
                                width={100}
                                height={100}
                                className="rounded-circle border"
                                style={{ objectFit: "cover" }}
                            />
                            <br />
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm mt-2"
                                onClick={handleDeleteProfilePic}
                                disabled={loading}
                            >
                                Delete Picture
                            </button>
                        </div>
                    ) : (
                        <p>No profile picture</p>
                    )}

                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="form-control"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    Save Changes
                </button>
            </form>

            <hr />

            <button
                className="btn btn-danger w-100"
                onClick={handleDeleteAccount}
                disabled={loading}
            >
                Delete Account
            </button>
        </div>
    )
}

export default EditUser
