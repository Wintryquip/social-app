import React, { useState } from "react"
import axios from "axios"

const EditComment = ({ comment, user, token, fetchPosts, onFinishEdit }) => {
    const [text, setText] = useState(comment.text)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.patch(
                "http://localhost:8080/comment/edit",
                {
                    _id: comment._id,
                    text,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            fetchPosts()
            onFinishEdit()
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            } else {
                setError("Something went wrong.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleEditSubmit} style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "10px",
            backgroundColor: "#f9f9f9"
        }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #aaa",
                    resize: "vertical",
                    marginBottom: "10px"
                }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    onClick={onFinishEdit}
                    disabled={loading}
                    style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        backgroundColor: "#ccc",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
            </div>
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
        </form>
    )
}

export default EditComment
