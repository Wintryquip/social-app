import { useState, useEffect } from "react"
import axios from "axios"

const EditPost = ({ post, fetchPosts }) => {
    const [content, setContent] = useState(post.content || "")
    const [images, setImages] = useState([])
    const [error, setError] = useState("")
    const token = localStorage.getItem("token")

    useEffect(() => {
        setContent(post.content || "")
    }, [post])

    const handleImagesChange = (e) => {
        setImages(Array.from(e.target.files))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append("_id", post._id)
            formData.append("content", content)
            images.forEach((image) => formData.append("images", image))

            await axios.patch("http://localhost:8080/post/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            })

            fetchPosts()
            setError("")
            setImages([])
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            } else {
                setError("Unexpected error occurred")
            }
        }
    }

    return (
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginTop: "20px" }}>
            <h2 style={{ marginBottom: "10px" }}>Edit your post</h2>
            {error && <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <textarea
                        name="content"
                        placeholder="Update your content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #aaa",
                            resize: "vertical"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="file"
                        name="images"
                        multiple
                        accept="image/png, image/jpeg"
                        onChange={handleImagesChange}
                    />
                </div>

                <button type="submit" style={{ padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
                    Update post
                </button>
            </form>
        </div>
    )
}

export default EditPost
