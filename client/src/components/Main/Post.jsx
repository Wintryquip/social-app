import React, { useState } from "react"
import axios from "axios"
import Comment from "./Comment"
import EditComment from "./EditComment"
import EditPost from "./EditPost"
import {
    Heart,
    HeartFill,
    Trash,
    Pencil,
    Clock,
    Send
} from 'react-bootstrap-icons';

const Post = ({ post, user, token, onPostLike, fetchPosts }) => {
    const [comments, setComments] = useState({})
    const [error, setError] = useState(null)
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [isEditingPost, setIsEditingPost] = useState(false)
    const [expandedImageIndex, setExpandedImageIndex] = useState(null);

    const handleCommentChange = (postId, text) => {
        setComments((prev) => ({ ...prev, [postId]: text }))
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:8080/comment/create", {
                _id: postId,
                text: comments[postId],
                author: user._id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setComments((prev) => ({ ...prev, [postId]: "" }))
            fetchPosts()
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await axios.delete("http://localhost:8080/comment/delete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { _id: commentId },
            })
            fetchPosts()
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    const handlePostLike = (e) => {
        e.preventDefault()
        onPostLike(post._id)
    };

    const handlePostDelete = async (e, postId) => {
        e.preventDefault()
        try {
            await axios.delete("http://localhost:8080/post/delete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { _id: postId },
            })
            fetchPosts()
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    };

    return (
        <div className="card shadow-sm mb-4 border-0">
            {/* Post Header */}
            <div className="card-header bg-white d-flex align-items-center">
                <div className="d-flex align-items-center">
                    <img
                        src={
                            post.author.profilePic
                                ? "http://localhost:8080" + post.author.profilePic
                                : "http://localhost:8080/uploads/images/profile/default/default.png"
                        }
                        alt="Author profile"
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    <div>
                        <h6 className="mb-0 fw-bold">{post.author.login}</h6>
                        <small className="text-muted">
                            <Clock className="me-1" size={12} />
                            {new Date(post.createdAt).toLocaleString()}
                        </small>
                    </div>
                </div>

                {user?.login === post.author.login && !isEditingPost && (
                    <div className="ms-auto">
                        <button
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={(e) => handlePostDelete(e, post._id)}
                        >
                            <Trash size={14} />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setIsEditingPost(true)}
                        >
                            <Pencil size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="card-body">
                {isEditingPost ? (
                    <EditPost
                        post={post}
                        fetchPosts={() => {
                            fetchPosts();
                            setIsEditingPost(false);
                        }}
                    />
                ) : (
                    <>
                        {post.content && <p className="mb-3">{post.content}</p>}

                        {post.images.length > 0 && (
                            <div className="mb-3">
                                {/* Główne zdjęcie */}
                                <div className="mb-2 text-center">
                                    <img
                                        src={"http://localhost:8080" + post.images[0]}
                                        alt="Main"
                                        className="img-fluid rounded shadow"
                                        style={{ maxHeight: "400px", objectFit: "cover", cursor: "pointer" }}
                                        onClick={() => setExpandedImageIndex(0)}
                                    />
                                </div>

                                {/* Miniaturki */}
                                <div className="d-flex flex-wrap justify-content-center gap-2">
                                    {post.images.slice(1).map((image, idx) => (
                                        <img
                                            key={idx + 1}
                                            src={"http://localhost:8080" + image}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="rounded border"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setExpandedImageIndex(idx + 1)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Like Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted small">
                        {Array.isArray(post.likes) && post.likes.length > 0
                            ? `${post.likes.length} ${post.likes.length === 1 ? 'like' : 'likes'}`
                            : "No likes yet"}
                    </div>
                    {token && (
                        <button
                            className={`btn btn-sm ${post.likes.some((like) => like.login === user?.login)
                                ? 'text-danger'
                                : 'text-muted'}`}
                            onClick={handlePostLike}
                        >
                            {post.likes.some((like) => like.login === user?.login)
                                ? <HeartFill size={20} />
                                : <Heart size={20} />}
                        </button>
                    )}
                </div>

                {/* Comments Section */}
                <div className="mb-3">
                    {post.comments.map((comment) => {
                        const isAuthor = comment.author.login === user?.login;
                        const isEditing = editingCommentId === comment._id;

                        return (
                            <div key={comment._id} className="mb-2">
                                {isEditing ? (
                                    <EditComment
                                        comment={comment}
                                        user={user}
                                        token={token}
                                        fetchPosts={fetchPosts}
                                        onFinishEdit={() => setEditingCommentId(null)}
                                    />
                                ) : (
                                    <div className="d-flex">
                                        <Comment
                                            comment={comment}
                                            user={user}
                                            token={token}
                                            fetchPosts={fetchPosts}
                                            onEditClick={() => setEditingCommentId(comment._id)}
                                            onDeleteClick={handleCommentDelete}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Add Comment */}
                {user ? (
                    <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="mt-3">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                placeholder="Write a comment..."
                                value={comments[post._id] || ""}
                                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                            />
                            <button
                                className="btn btn-primary rounded-pill ms-2"
                                type="submit"
                                disabled={!comments[post._id]}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="alert alert-light text-center py-2">
                        <small>Log in to comment</small>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {expandedImageIndex !== null && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0">
                            <div className="modal-header border-0">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setExpandedImageIndex(null)}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <img
                                    src={"http://localhost:8080" + post.images[expandedImageIndex]}
                                    alt="Expanded content"
                                    className="img-fluid"
                                    style={{ maxHeight: '80vh' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Post