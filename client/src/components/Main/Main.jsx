import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import UploadPost from "./UploadPost"
import axios from "axios"
import Post from "./Post"
import EditPost from "./EditPost"
import { Spinner } from "react-bootstrap"

const Main = () => {
    const [posts, setPosts] = useState(null)
    const [error, setError] = useState(null)
    const [postToEdit, setPostToEdit] = useState(null)
    const { user } = useContext(UserContext)
    const token = localStorage.getItem("token")

    const fetchPosts = () => {
        fetch("http://localhost:8080/post/show")
            .then((res) => {
                if (!res.ok) throw new Error("Network error.")
                return res.json()
            })
            .then((data) => setPosts(data))
            .catch((err) => setError(err.message))
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handlePostLike = async (postId) => {
        try {
            await axios.post(
                "http://localhost:8080/post/like",
                { _id: postId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            fetchPosts()
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status.status <= 500
            ) {
                setError(error.response.data.message)
            }
        }
    }

    const handleEditClick = (post) => {
        setPostToEdit(post)
    }

    const handleFinishEdit = () => {
        setPostToEdit(null)
        fetchPosts()
    }

    if (error) return (
        <div className="alert alert-danger text-center rounded-pill mt-4">
            Error: {error}
        </div>
    )

    if (!posts) return (
        <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading posts...</p>
        </div>
    )

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="text-primary mb-4 text-center">
                        <i className="bi bi-newspaper me-2"></i>
                        Community Posts
                    </h2>

                    {localStorage.getItem("login") && !postToEdit && (
                        <div className="card shadow-sm mb-4 border-0">
                            <div className="card-body">
                                <UploadPost fetchPosts={fetchPosts} />
                            </div>
                        </div>
                    )}

                    {localStorage.getItem("login") && postToEdit && (
                        <div className="card shadow-sm mb-4 border-primary">
                            <div className="card-body">
                                <EditPost post={postToEdit} fetchPosts={handleFinishEdit} />
                            </div>
                        </div>
                    )}

                    <div className="posts-container">
                        {posts.map((post) => (
                            <div key={post._id} className="mb-4">
                                <Post
                                    post={post}
                                    user={user}
                                    token={token}
                                    onPostLike={handlePostLike}
                                    fetchPosts={fetchPosts}
                                    onEdit={() => handleEditClick(post)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main