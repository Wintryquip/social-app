import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-light text-center text-md-start mt-auto py-4" style={{borderTop: "1px solid #dee2e6"}}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6 text-muted small">
                        Created by Mateusz Kędra as the final project for the course "Programming Frameworks in Web Applications"
                    </div>
                    <div className="col-md-6 text-md-end mt-3 mt-md-0">
                        <Link to="/terms" className="text-decoration-none text-muted me-3">Terms</Link>
                        <Link to="/privacy" className="text-decoration-none text-muted me-3">Privacy Policy</Link>
                        <Link to="/cookies" className="text-decoration-none text-muted">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;