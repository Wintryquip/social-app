import { useState } from "react"
import axios from "axios"

const UploadPost = ({ fetchPosts }) => {
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])
    const [error, setError] = useState("")
    const token = localStorage.getItem("token")

    const handleImagesChange = (e) => {
        setImages(Array.from(e.target.files))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("content", content)
            images.forEach((image) => formData.append("images", image))

            const url = "http://localhost:8080/post/create"

            await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            })

            fetchPosts()
            setContent("")
            setImages([])
            setError("")
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            } else {
                setError("Unexpected error occurred")
            }
        }
    }

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "20px auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h1
                style={{
                    marginBottom: "20px",
                    fontSize: "24px",
                    color: "#333",
                    textAlign: "center",
                }}
            >
                Create your post
            </h1>

            {error && (
                <div
                    style={{
                        marginBottom: "15px",
                        color: "#d32f2f",
                        backgroundColor: "#fdecea",
                        padding: "10px",
                        borderRadius: "6px",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <textarea
                    name="content"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                    style={{
                        resize: "vertical",
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        outline: "none",
                        fontFamily: "inherit",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                        transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2a7ae2")}
                    onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                />

                <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={handleImagesChange}
                    style={{
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        padding: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        backgroundColor: "#2a7ae2",
                        color: "white",
                        padding: "12px",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#1a5fcc")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#2a7ae2")}
                >
                    Upload post
                </button>
            </form>
        </div>
    )
}

export default UploadPost
