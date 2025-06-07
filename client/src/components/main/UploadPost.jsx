import { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "../../contexts/UserContext"

const UploadPost = ({ fetchPosts }) => {
    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT
    const { user } = useContext(UserContext)
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])
    const [error, setError] = useState("")
    const token = user?.token

    const handleImagesChange = (e) => {
        setImages(Array.from(e.target.files))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("content", content)
            images.forEach((image) => formData.append("images", image))

            const url = `${baseUrl}:${port}/post/create`

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
        <div className="container my-4" style={{ maxWidth: "600px" }}>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h1 className="card-title text-center mb-4" style={{ fontSize: "24px" }}>
                        Create your post
                    </h1>

                    {error && (
                        <div className="alert alert-danger text-center fw-semibold" role="alert">
                            Error: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <textarea
                name="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="form-control"
            />

                        <input
                            type="file"
                            name="images"
                            multiple
                            accept="image/png, image/jpeg"
                            onChange={handleImagesChange}
                            className="form-control"
                        />

                        <button type="submit" className="btn btn-primary fw-semibold">
                            Upload post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UploadPost
