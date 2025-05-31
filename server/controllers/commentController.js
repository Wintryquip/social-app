const { Comment, validate } = require('../models/comment');
const { Post} = require("../models/post");
const {Types} = require("mongoose");
const {sendNotification} = require("./notificationController");
const mongoose = require("mongoose");

/*
    Function allowing user to leave comment under chosen post.
 */
const createComment = async (req, res) => {
    try {
        const { _id, ...bodyWithoutId } = req.body
        const { error } = validate(bodyWithoutId);
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        req.body = { _id: _id, ...bodyWithoutId };
        const post = await Post.findById(req.body._id)
        if (!post) {
            console.error(new Date(), "Post does not exist.")
            return res.status(404).send({ message: "Post does not exist."})
        }
        const comment = new Comment({
            post: new Types.ObjectId(req.body._id),
            author: req.user._id,
            text: req.body.text
        })
        await comment.save()
        post.comments.push(comment._id)
        await post.save()
        console.log(post.author)
        req.notification = {
            recipient: post.author,
            type: 'comment',
            fromUser: new mongoose.Types.ObjectId(req.user._id),
            post: post._id
        }
        await sendNotification(req, res)
        res.status(200).send({ message: "Comment saved." })
    } catch (error) {
        console.error(new Date(), "Error creating post:", error)
        res.status(500).send({ message: "Internal server error!" })
    }
}

/*
    Function allowing user to modify his comment.
    It ensures that the user is the author of chosen comment.
 */
const editComment = async (req, res) => {
    try {
        console.log(new Date(), "User", req.user, "tries to edit a comment.");
        // store comment
        const comment = await Comment.findById(req.body._id)
        // Comment does not exist
        if (!comment) {
            return res.status(404).send({ message: "Comment not found."})
        }
        // Ensure user is author of the comment
        if(comment.author.toString() !== req.user._id.toString()) {
            console.error(new Date(), "WARNING: Unauthorized edit attempt! User", req.user, "tried to modify comment", req.body._id , "which does not belong to him.")
            return res.status(403).send({ message: "Post does not belongs to you!"})
        }
        // validation without id
        const { _id, ...bodyWithoutId } = req.body
        const { error } = validate(bodyWithoutId);
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        req.body = { _id: _id, ...bodyWithoutId };
        const updatedComment = await Comment.findByIdAndUpdate(req.body._id,
            { $set: req.body })
        await updatedComment.save()
        console.log(new Date(), "Comment modified successfully.")
        res.status(200).send({ message: "Comment modified successfully."})
    } catch (error) {
        console.error(new Date(), "Error editing post:", error)
        res.status(500).send({ message: "Internal server error!" })
    }
}

/*
    Function that allows user to like someone's comment.
    It pushes likes array in the database with user_id.
 */
const likeComment = async (req, res) => {
    try {
        // store comment
        const comment = await Comment.findById(req.body._id)
        // comment does not exist
        if (!comment) {
            console.error(new Date(), "Comment does not exist.")
            return res.status(404).send({ message: "Comment does not exist."})
        }
        let isAlreadyLiked = false
        const likes = comment.likes
        if (likes.length > 0) {
            for (const like of likes) {
                if(like.toString() === req.user._id.toString()) {
                    isAlreadyLiked = true
                    break
                }
            }
        }
        const userId = new mongoose.Types.ObjectId(req.user._id)
        if (isAlreadyLiked) {
            comment.likes.pull(userId)
            await comment.save()
            res.status(200).send({ message: "Comment disliked."})
        } else {
            comment.likes.push(userId)
            await comment.save()
            req.notification = {
                recipient: comment.author,
                type: 'commentLike',
                fromUser: new mongoose.Types.ObjectId(req.user._id),
                comment: comment._id
            }
            await sendNotification(req, res)
            res.status(200).send({ message: "Comment liked successfully."})
        }
    } catch (error) {
        console.error(new Date(), "Error liking post:", error)
        res.status(500).send({ message: "Internal server error!" })
    }
}

/*
    Function that allows user to delete comment.
    It checks if the comment exists and makes sure that
    user is the author of the comment.
 */
const deleteComment = async (req, res) => {
    try {
        // Store comment
        const comment = await Comment.findById(req.body._id)
        // Comment does not exist
        if (!comment) {
            return res.status(404).send({ message: "Comment not found."})
        }
        // Ensure user is author of the comment
        if(comment.author.toString() !== req.user._id.toString()) {
            console.error(new Date(), "WARNING: Unauthorized edit attempt! User", req.user, "tried to delete comment", req.body._id , "which does not belong to him.")
            return res.status(403).send({ message: "Comment does not belongs to you!"})
        }
        // Delete comment
        await Comment.findByIdAndDelete(req.body._id)
        // Delete associations with the comment in posts.
        const post = await Post.findOne({ comments: req.body._id })
        post.comments.pull(req.body._id)
        await post.save()
        console.log(new Date(), "Comment", req.body._id.toString(), "has been deleted.")
        return res.status(200).send({ message: "Comment deleted."})
    } catch (error) {
        console.error(new Date(), "Error deleting post:", error)
        res.status(500).send({ message: "Internal server error!" })
    }
}

module.exports = { createComment, editComment, likeComment, deleteComment }