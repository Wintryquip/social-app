import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const Navbar = () => {
    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT
    const { user, logout } = useContext(UserContext)
    const [notifications, setNotifications] = useState(null)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
    }

    const fetchNotifications = () => {
        fetch(`${baseUrl}:${port}/notification/show`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No network response.")
                }
                return response.json()
            })
            .then(data => setNotifications(data.notifications))
            .catch(err => setError(err))
    };

    useEffect(() => {
        if (user) {
           fetchNotifications()
        } else {
            setNotifications(null)
        }
    }, [user])

    const markNotificationAsRead = (id) => {
        fetch(`${baseUrl}:${port}/notification/read`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ _id: id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to mark notification as read.")
                }
            })
            .then(() => {
                fetchNotifications()
            })
            .catch(error => {
                console.error("Error updating notification:", error)
            })
    }

    const loginName = user?.login
    const profilePic = user?.profilePic

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
            <Link className="navbar-brand fw-bold text-primary" to="/">
                SocialApp
            </Link>

            <div className="d-none d-md-block mx-auto" style={{ width: "35%" }}>
                <form
                    className="d-flex position-relative"
                    role="search"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (searchQuery.trim()) {
                            navigate(`/search/${encodeURIComponent(searchQuery.trim())}`)
                            setSearchQuery("")
                        }
                    }}
                >
                    <input
                        className="form-control rounded-pill px-3"
                        type="search"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            <ul className="navbar-nav ms-auto align-items-center">
                {!user ? (
                    <li className="nav-item dropdown">
                        <button className="btn btn-outline-primary dropdown-toggle rounded-pill px-3" data-bs-toggle="dropdown">
                            Account
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/login">Log In</Link></li>
                            <li><Link className="dropdown-item" to="/register">Register</Link></li>
                        </ul>
                    </li>
                ) : (
                    <>
                        {/* Notifications Dropdown */}
                        <li className="nav-item dropdown mx-2">
                            <button className="btn btn-light position-relative rounded-circle" data-bs-toggle="dropdown" style={{ width: "2.5rem", height: "2.5rem" }}>
                                🔔
                                {error && (
                                    <li className="dropdown-item text-danger small">
                                        Error: {error.message || "Something went wrong."}
                                    </li>
                                )}

                                {Array.isArray(notifications) && notifications.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                {Array.isArray(notifications) && notifications.length === 0 && (
                                    <li className="dropdown-item text-muted small">No notifications.</li>
                                )}
                                {Array.isArray(notifications) && notifications.map((notification) => {
                                    const notificationType = notification.type;
                                    // In case user deleted
                                    const from = notification.fromUser?.login || "Deleted user";

                                    switch (notificationType) {
                                        case "comment":
                                            return (
                                                <li key={notification._id} className="dropdown-item text-muted small" onMouseEnter={() => {
                                                    if (!notification.read) markNotificationAsRead(notification._id)
                                                }}>
                                                    {from} commented your post.
                                                </li>
                                            )
                                        case "like":
                                            return (
                                                <li key={notification._id} className="dropdown-item text-muted small" onMouseEnter={() => {
                                                    if (!notification.read) markNotificationAsRead(notification._id)
                                                }}>
                                                    {from} liked your post.
                                                </li>
                                            )
                                        case "commentLike":
                                            return (
                                                <li key={notification._id} className="dropdown-item text-muted small" onMouseEnter={() => {
                                                    if (!notification.read) markNotificationAsRead(notification._id)
                                                }}>
                                                    {from} liked your comment.
                                                </li>
                                            )
                                        case "follow":
                                            return (
                                                <li key={notification._id} className="dropdown-item text-muted small" onMouseEnter={() => {
                                                    if (!notification.read) markNotificationAsRead(notification._id)
                                                }}>
                                                    {from} is now following you.
                                                </li>
                                            )
                                        default:
                                            return (
                                                <li key={notification._id || Math.random()} className="dropdown-item text-muted small" onMouseEnter={() => {
                                                    if (!notification.read) markNotificationAsRead(notification._id)
                                                }}>
                                                    Unknown notification
                                                </li>
                                            )
                                    }
                                })}
                            </ul>
                        </li>

                        {/* User Dropdown */}
                        <li className="nav-item dropdown">
                            <button className="btn btn-light dropdown-toggle d-flex align-items-center px-2 rounded-pill" data-bs-toggle="dropdown">
                                <img
                                    src={`${baseUrl}:${port}${profilePic}`}
                                    alt="profile"
                                    className="rounded-circle me-2"
                                    style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                />
                                <span className="fw-semibold">{loginName}</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to={`/profile/${user?.login}`}>My Profile</Link></li>
                                <li><Link className="dropdown-item" to="/edit-profile">Edit Profile</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Log Out</button></li>
                            </ul>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar
