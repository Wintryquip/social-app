import React from "react";
import { Link } from "react-router-dom";
import { EmojiFrown } from "react-bootstrap-icons";

const NotFound = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <div className="text-center" style={{ maxWidth: "600px" }}>
                <EmojiFrown className="text-primary" style={{ fontSize: "5rem", marginBottom: "2rem" }} />
                <h1 className="display-4 text-primary mb-4">404 - Page Not Found</h1>
                <p className="lead text-muted mb-5">
                    The page you're looking for doesn't exist or has been moved.
                    Please check the URL or use the options below.
                </p>

                <div className="d-flex justify-content-center gap-3">
                    <Link
                        to="/"
                        className="btn btn-primary btn-lg rounded-pill px-4"
                    >
                        Home Page
                    </Link>
                </div>

                <footer className="text-center mt-5 text-muted small">
                    © 2025 Your Company. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default NotFound;