import React, { useEffect, useState } from "react"
import {Link, useParams} from "react-router-dom"

const SearchUsers = () => {
    const { login } = useParams()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${baseUrl}:${port}/user/search/${login}`)
                if (!res.ok)
                    throw new Error("No users found.")
                const data = await res.json()
                setUsers(data.users || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [login])

    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5">
                <h3 className="mb-4 text-center">
                    Search results for: <strong>{login}</strong>
                </h3>

                {loading && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && users.length === 0 && (
                    <p className="text-muted">No users found.</p>
                )}

                <div className="w-100" style={{ maxWidth: "600px" }}>
                    {users.map(user => (
                        <Link
                            to={`/profile/${user.login}`}
                            key={user._id}
                            className="card mb-3 shadow-sm text-decoration-none text-dark"
                        >
                            <div className="card-body d-flex align-items-center">
                                <img
                                    src={
                                        user.profilePic && user.profilePic.trim() !== ""
                                            ? (
                                                user.profilePic.startsWith("http")
                                                    ? user.profilePic
                                                    : `${baseUrl}:${port}${user.profilePic}`
                                            )
                                            : `${baseUrl}:${port}/uploads/images/profile/default/default.png`
                                    }
                                    alt="profile"
                                    className="rounded-circle me-3"
                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                />
                                <div>
                                    <h5 className="mb-1">{user.login}</h5>
                                    <p className="mb-0 text-muted">{user.bio}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default SearchUsers
