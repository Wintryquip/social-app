import React, { useState } from "react"
import axios from "axios"

const EditComment = ({ comment, user, fetchPosts, onFinishEdit }) => {
    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT
    const [text, setText] = useState(comment.text)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.patch(
                `${baseUrl}:${port}/comment/edit`,
                {
                    _id: comment._id,
                    text,
                },
                {
                    withCredentials: true
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
        <form
            onSubmit={handleEditSubmit}
            className="border rounded p-3 mt-3 bg-light"
        >
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="form-control mb-3"
      />

            <div className="d-flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    onClick={onFinishEdit}
                    disabled={loading}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="text-danger mt-3">
                    {error}
                </div>
            )}
        </form>
    )
}

export default EditComment
