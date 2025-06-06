import React from "react"
import { ExclamationTriangle } from "react-bootstrap-icons"

const ServerError = ({ error }) => {
    return (
        <div
            className="container d-flex flex-column align-items-center justify-content-center bg-danger bg-opacity-10 text-danger"
            style={{ minHeight: "80vh", textAlign: "center", padding: "2rem", borderRadius: "0.5rem", marginTop: "50px", marginBottom: "50px" }}
        >
            <ExclamationTriangle style={{ fontSize: "6rem", marginBottom: "1.5rem" }} />
            <h1 className="display-4 mb-3">Server Error</h1>
            <p className="lead mb-4">
                {error || "The server might be offline or experiencing issues."}
            </p>
            <p className="mb-4 text-muted">
                Please try refreshing the page or come back later.
            </p>
        </div>
    )
}

export default ServerError