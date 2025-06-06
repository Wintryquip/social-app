import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const Navbar = () => {
    const { user, logout } = useContext(UserContext);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("login");
        localStorage.removeItem("profilePic");
        window.location.reload();
    };

    const loginName = localStorage.getItem("login");
    const profilePic = localStorage.getItem("profilePic");

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
            <Link className="navbar-brand fw-bold text-primary" to="/">
                SocialApp
            </Link>

            <div className="d-none d-md-block mx-auto" style={{ width: "35%" }}>
                <form className="d-flex" role="search" onSubmit={e => e.preventDefault()}>
                    <input
                        className="form-control rounded-pill px-3"
                        type="search"
                        placeholder="Search users..."
                        aria-label="Search"
                        disabled
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
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    3
                                </span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li className="dropdown-item text-muted small">Anna liked your post</li>
                                <li className="dropdown-item text-muted small">John commented: "Nice!"</li>
                                <li className="dropdown-item text-muted small">New follower: Mike</li>
                            </ul>
                        </li>

                        {/* User Dropdown */}
                        <li className="nav-item dropdown">
                            <button className="btn btn-light dropdown-toggle d-flex align-items-center px-2 rounded-pill" data-bs-toggle="dropdown">
                                <img
                                    src={
                                        profilePic
                                            ? (profilePic.startsWith("http") ? profilePic : `http://localhost:8080${profilePic}`)
                                            : "http://localhost:8080/uploads/images/profile/default/default.png"
                                    }
                                    alt="profile"
                                    className="rounded-circle me-2"
                                    style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                />
                                <span className="fw-semibold">{loginName}</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                                <li><Link className="dropdown-item" to="/settings">Account Settings</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Log Out</button></li>
                            </ul>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
