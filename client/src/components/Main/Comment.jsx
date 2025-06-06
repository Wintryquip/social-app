import React, { useState } from "react"
import axios from "axios"
import { Heart, HeartFill } from 'react-bootstrap-icons'

const Comment = ({ comment, user, token, fetchPosts, onEditClick, onDeleteClick }) => {
    const [error, setError] = useState(null)

    const handleCommentLike = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                "http://localhost:8080/comment/like",
                { _id: comment._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            fetchPosts()
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }

    const isAuthor = user?.login === comment.author.login

    return (
        <div
            key={comment._id}
            style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #ddd",
                padding: "10px",
                marginTop: "10px",
                borderRadius: "6px",
                backgroundColor: "#fafafa",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <img
                    src={
                        comment.author.profilePic
                            ? "http://localhost:8080" + comment.author.profilePic
                            : "http://localhost:8080/uploads/images/profile/default/default.png"
                    }
                    alt="Profile"
                    style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                />
                <strong>{comment.author.login}</strong>
            </div>

            <div style={{ marginBottom: "8px", whiteSpace: "pre-wrap" }}>
                {comment.text}
            </div>

            {/* Sekcja lajków */}
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '13px', color: '#666' }}>
                <div>
                    {Array.isArray(comment.likes) && comment.likes.length > 0
                        ? `${comment.likes.length} ${comment.likes.length === 1 ? 'like' : 'likes'}`
                        : "No likes yet"}
                </div>
                {token && (
                    <button
                        className={`btn btn-sm d-flex align-items-center ${comment.likes.some(like => like.login === user?.login) ? 'text-danger' : 'text-muted'}`}
                        onClick={handleCommentLike}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        aria-label={comment.likes.some(like => like.login === user?.login) ? "Unlike" : "Like"}
                    >
                        {comment.likes.some(like => like.login === user?.login)
                            ? <HeartFill size={18} />
                            : <Heart size={18} />}
                    </button>
                )}
            </div>

            {isAuthor && (
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => onEditClick(comment._id)}
                        style={{
                            padding: "6px 14px",
                            fontSize: "14px",
                            borderRadius: "5px",
                            border: "1px solid #2a7ae2",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: "#2a7ae2",
                            fontWeight: "600",
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteClick(comment._id)}
                        style={{
                            padding: "6px 14px",
                            fontSize: "14px",
                            borderRadius: "5px",
                            border: "1px solid #d32f2f",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: "#d32f2f",
                            fontWeight: "600",
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}

            {error && <div style={{ color: "red", marginTop: "8px" }}>Error: {error}</div>}
        </div>
    )
}

export default Comment
