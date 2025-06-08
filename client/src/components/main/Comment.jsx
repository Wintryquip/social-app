import React, { useState } from "react"
import axios from "axios"
import { Heart, HeartFill } from 'react-bootstrap-icons'
import { Link } from "react-router-dom"

const Comment = ({ comment, user, fetchPosts, onEditClick, onDeleteClick }) => {
    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT
    const [error, setError] = useState(null)

    const handleCommentLike = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                `${baseUrl}:${port}/comment/like`,
                { _id: comment._id },
                {
                    withCredentials: true
                }
            )
            fetchPosts()
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }

    const isAuthor = user?.login && comment?.author?.login && user.login === comment.author.login

    return (
        <div className="w-100 border p-3 mt-3 rounded bg-light">
            {/* Author info */}
            <div className="d-flex align-items-center mb-2">
                <img
                    src={
                        comment.author?.profilePic
                            ? `${baseUrl}:${port}${comment.author.profilePic}`
                            : `${baseUrl}:${port}/uploads/images/profile/default/default.png`
                    }
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px" }}
                />
                <strong>
                    {comment.author?.login ? (
                        <Link
                            to={`/profile/${comment.author.login}`}
                            className="text-decoration-none text-dark"
                        >
                            {comment.author.login}
                        </Link>
                    ) : (
                        <span className="text-danger">USER DELETED</span>
                    )}
                </strong>
            </div>

            {/* Comment text */}
            <div className="mb-2" style={{ whiteSpace: "pre-wrap" }}>
                {comment.text}
            </div>

            {/* Likes */}
            <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                <div>
                    {Array.isArray(comment.likes) && comment.likes.length > 0
                        ? `${comment.likes.length} ${comment.likes.length === 1 ? 'like' : 'likes'}`
                        : "No likes yet"}
                </div>
                {user && (
                    <button
                        className={`btn btn-sm d-flex align-items-center ${comment.likes?.some(like => like.login === user?.login) ? 'text-danger' : 'text-muted'}`}
                        onClick={handleCommentLike}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        aria-label={comment.likes?.some(like => like.login === user?.login) ? "Unlike" : "Like"}
                    >
                        {comment.likes?.some(like => like.login === user?.login)
                            ? <HeartFill size={18} />
                            : <Heart size={18} />}
                    </button>
                )}
            </div>

            {/* Author controls */}
            {isAuthor && (
                <div className="d-flex gap-2">
                    <button
                        onClick={() => onEditClick(comment._id)}
                        className="btn btn-outline-primary btn-sm fw-semibold"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteClick(comment._id)}
                        className="btn btn-outline-danger btn-sm fw-semibold"
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* Error */}
            {error && <div className="text-danger mt-2">Error: {error}</div>}
        </div>
    )
}

export default Comment
