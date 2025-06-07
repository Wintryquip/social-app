import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import UploadPost from "./UploadPost"
import axios from "axios"
import Post from "./Post"
import EditPost from "./EditPost"
import { Spinner } from "react-bootstrap"
import ServerError from "../pages/ServerError";

const Main = () => {
    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT
    const [posts, setPosts] = useState(null)
    const [error, setError] = useState(null)
    const [postToEdit, setPostToEdit] = useState(null)
    const { user } = useContext(UserContext)
    const token = user?.token

    const fetchPosts = () => {
        fetch(`${baseUrl}:${port}/post/show`)
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
                `${baseUrl}:${port}/post/like`,
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

    if (error) return <ServerError error={error} />

    if (!posts) return (
        <div className="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading posts...</p>
        </div>
    )

    if (posts.length === 0) {
        return (
            <div className="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
                {user?.login && (
                    <div className="card shadow-sm mb-4 border-0 w-100" style={{ maxWidth: '600px' }}>
                        <div className="card-body">
                            <UploadPost fetchPosts={fetchPosts} />
                        </div>
                    </div>
                )}
                <h3 className="text-muted mb-4">No posts available.</h3>
            </div>
        )
    }


    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="text-primary mb-4 text-center">
                        <i className="bi bi-newspaper me-2"></i>
                        Community Posts
                    </h2>

                    {user?.login && !postToEdit && (
                        <div className="card shadow-sm mb-4 border-0">
                            <div className="card-body">
                                <UploadPost fetchPosts={fetchPosts} />
                            </div>
                        </div>
                    )}

                    {user?.login && postToEdit && (
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