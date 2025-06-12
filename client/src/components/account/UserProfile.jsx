import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import Post from "../main/Post"
import axios from "axios"
import { Spinner, Button } from "react-bootstrap"
import ServerError from "../pages/ServerError"
import { FaHeart, FaRegHeart } from "react-icons/fa"

const UserProfile = () => {
    const baseUrl = process.env.REACT_APP_API_URL
    const port = process.env.REACT_APP_API_PORT

    const { user } = useContext(UserContext)
    const { login } = useParams()

    const [profileUser, setProfileUser] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [error, setError] = useState(null)
    const [loadingFollow, setLoadingFollow] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${baseUrl}:${port}/user/profile/${login}`)
            const fetchedUser = res.data.user
            setProfileUser(fetchedUser)

            if (user && fetchedUser.followers) {
                for (const follower of fetchedUser.followers) {
                    if (user.login === follower.login) {
                        setIsFollowing(true)
                        break
                    }
                }
            }

            await fetchUserPosts()
        } catch (err) {
            setError("Failed to load user profile.")
        }
    }

    const fetchUserPosts = async () => {
        try {
            const res = await axios.get(`${baseUrl}:${port}/post/show`)
            const filtered = res.data.filter(post => post.author.login === login)
            setUserPosts(filtered)
        } catch (err) {
            setError("Failed to load user's posts.")
        }
    }

    const handlePostLike = async (postId) => {
        try {
            await axios.post(
                `${baseUrl}:${port}/post/like`,
                { _id: postId },
                {
                    withCredentials: true
                }
            )
            await fetchUserPosts()
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    };

    const handleFollowToggle = async () => {
        if (!user || !profileUser) return

        setLoadingFollow(true)
        try {
            await axios.post(
                `${baseUrl}:${port}/user/follow`,
                { _id: profileUser._id },
                {
                    withCredentials: true
                }
            )

            // Refresh data to get updated follow state
            await fetchUserData()
            setIsFollowing(!isFollowing)
        } catch (err) {
            setError("Failed to update follow status.")
        } finally {
            setLoadingFollow(false);
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [login, user])

    if (error)
        return <ServerError error={error} />

    if (!profileUser)
        return (
            <div className="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading user profile...</p>
            </div>
        )

    return (
        <div className="container mt-4 d-flex flex-column min-vh-100">
            <div className="text-center mb-5">
                <img
                    src={
                        profileUser.profilePic
                            ? `${baseUrl}:${port}${profileUser.profilePic}`
                            : `${baseUrl}:${port}/uploads/images/profile/default/default.png`
                    }
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <h3>{profileUser.login}</h3>

                {profileUser.bio && (
                    <p className="mb-2 text-secondary fst-italic text-wrap text-break">
                        {profileUser.bio}
                    </p>
                )}

                <p className="text-muted mb-1">
                    Joined on {new Date(profileUser.createdAt).toLocaleDateString()}
                </p>

                <p className="mb-3">
                    <strong>{profileUser.followers?.length || 0}</strong> followers &nbsp;|&nbsp;
                    <strong>{profileUser.following?.length || 0}</strong> following
                </p>

                {user && user._id !== profileUser._id && (
                    <Button
                        variant="link"
                        onClick={handleFollowToggle}
                        disabled={loadingFollow}
                        style={{
                            fontSize: "1.8rem",
                            color: isFollowing ? "red" : "gray",
                            border: "none",
                            background: "none",
                            cursor: "pointer"
                        }}
                        aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                    >
                        {isFollowing ? <FaHeart /> : <FaRegHeart />}
                    </Button>
                )}
            </div>

            <h4 className="mb-3 text-primary text-center">Posts by {profileUser.login}</h4>

            {userPosts.length === 0 ? (
                <div
                    className="alert alert-light text-center flex-grow-1 d-flex align-items-center justify-content-center"
                    style={{ minHeight: "300px" }}
                >
                    <small>This user hasn't posted anything yet.</small>
                </div>
            ) : (
                userPosts.map(post => (
                    <div key={post._id} className="mb-4">
                        <Post
                            post={post}
                            user={user}
                            onPostLike={handlePostLike}
                            fetchPosts={fetchUserPosts}
                        />
                    </div>
                ))
            )}
        </div>
    )
}

export default UserProfile
