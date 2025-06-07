const mongoose = require("mongoose")
const {validate, Post} = require("../models/post")
const { Comment } = require("../models/comment")
const { sendNotification } = require('./notificationController')
const fs = require("fs")
const path = require("path")

/*
    Function that returns all posts from the database.
 */
const showPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ updatedAt: -1 })
            .populate({
                path: 'likes',
                select: 'login'
            })
            .populate({
                path: 'author',
                select: 'login profilePic'
            })
            .populate({
                path: 'comments',
                select: 'text author likes',
                populate: [
                    {
                    path: 'author',
                    select: 'login profilePic'
                    },
                {
                    path: 'likes',
                    select: 'login'
                }]
            })
        res.status(200).send(posts)
    } catch (error) {
        console.log(new Date(), "Error fetching posts:", error)
        res.status(500).send({ message: "Internal server error!"})
    }
}

/*
    Function allowing user to create post. If user is trying to
    share images with the post directory for the images is created
    at ../uploads/images/posts/<post_id>
 */
const createPost = async (req, res) => {
    try {
        console.log(new Date(), "User", req.user, "tries to submit a post.")

        const {error} = validate(req.body)
        if(error)
            return res.status(400).send({message: error.details[0].message})

        // Saving author id for post
        const authorId = new mongoose.Types.ObjectId(req.user._id)
        req.author = authorId

        // Creating new post with empty images array
        const newPost = new Post({ author: authorId, content: req.body.content, images: [] })
        await newPost.save()

        const files = req.files ? req.files.images : null
        // If contains files
        if (files) {
            // Saving post id
            const postId = newPost._id
            // Ensuring that files is an array
            const imagesArray = Array.isArray(files) ? files : [files]

            const uploadPath = path.join(__dirname, "..", "uploads", "images", "posts", postId.toString())
            fs.mkdirSync(uploadPath, { recursive: true })

            for (const image of imagesArray) {
                // MIME validation
                if (!/^image/.test(image.mimetype)) {
                    await Post.findByIdAndDelete(postId)
                    return res.status(400).send({ message: "All files must be an images." })
                }

                // Size validation
                if (image.size > Number(process.env.MAXFILESIZE)) {
                    await Post.findByIdAndDelete(postId)
                    return res.status(400).send({ message: "Image size not allowed (max 2MB)." })
                }

                const imageName = Date.now() + "_" + image.name.replace(/\s+/g, "_")
                const imagePath = path.join(uploadPath, imageName)

                // Save file in server directory
                await image.mv(imagePath)

                // Save image directory in model
                const relativePath = `/uploads/images/posts/${postId}/${imageName}`
                newPost.images.push(relativePath)
            }
            await newPost.save()
        }

        console.log(new Date(), "User", req.user, "submitted a post.")
        res.status(201).send({ message: "Post created successfully" })
    } catch (error) {
        console.error(new Date(), "Error creating post:", error)
        res.status(500).send({ message: "Internal server error!" })
    }
}

/*
    Function that allows user to update his post.
    Code ensures that user is owner of the post.
    If user is updating images of the post function
    clears directory.
 */
const updatePost = async (req, res) => {
    try {
        console.log(new Date(), "User", req.user, "tries to edit a post signed by id", req.body._id)
        const post = await Post.findById(req.body._id) // Find post
        // post does not exist
        if(post === undefined) {
            console.error(new Date(), "Post does not exist.")
            return res.status(404).send({ message: "Post does not exist."})
        }
        // Unauthorized attempt
        const userId = new mongoose.Types.ObjectId(req.user._id)
        if(post.author.toString() !== userId.toString()) {
            console.error(new Date(), "WARNING: Unauthorized edit attempt! User", req.user, "tried to modify post", req.body._id , "which does not belong to him.")
            return res.status(403).send({ message: "Post does not belongs to you!"})
        }

        // validation without _id - validator requirement
        const { _id, ...bodyWithoutId } = req.body;
        const { error } = validate(bodyWithoutId);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const updatedPostData = { _id, ...bodyWithoutId };
        const updatedPost = await Post.findByIdAndUpdate(req.body._id,
            { $set: updatedPostData})
        const files = req.files ? req.files.images : null
        if (files) {
            const postId = req.body._id
            const imagesArray = Array.isArray(files) ? files : [files]
            const uploadPath = path.join(__dirname, "..", "uploads", "images", "posts", postId.toString())
            // Clear directory
            if (fs.existsSync(uploadPath)) {
                const files = fs.readdirSync(uploadPath);
                for (const file of files) {
                    const filePath = path.join(uploadPath, file);
                    // Check if it is a file not a directory
                    if (fs.lstatSync(filePath).isFile()) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            // Clear image directory in database
            updatedPost.images = []
            // Ensure creation of directory
            fs.mkdirSync(uploadPath, { recursive: true })
            for (const image of imagesArray) {
                // MIME validation
                if (!/^image/.test(image.mimetype)) {
                    return res.status(400).send({ message: "All files must be an images." })
                }
                // Size validation
                if (image.size > Number(process.env.MAXFILESIZE)) {
                    await Post.findByIdAndDelete(postId)
                    return res.status(400).send({ message: "Image size not allowed (max 2MB)." })
                }

                const imageName = Date.now() + "_" + image.name.replace(/\s+/g, "_")
                const imagePath = path.join(uploadPath, imageName)

                // Save file in server directory
                await image.mv(imagePath)

                // Save image directory in model
                const relativePath = `/uploads/images/posts/${postId}/${imageName}`
                updatedPost.images.push(relativePath)
            }
            await updatedPost.save()
        }
        console.log(new Date(), "Post modified successfully.")
        res.status(200).send({ message: "Post modified successfully."})
    } catch (error) {
        console.error(new Date(), "Error editing post:", error)
        res.status(500).send({ message: "Internal server error!" })
    }
}

/*
    Function that allows user to like someone's post.
    It pushes likes array in the database with user_id.
 */
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.body._id) // Find post
        // Post does not exist
        if(!post) {
            console.error(new Date(), "Post does not exist.")
            return res.status(404).send({ message: "Post does not exist."})
        }
        let isAlreadyLiked = false
        const likes = post.likes
        if (likes.length > 0) {
            for (const like of likes) {
                if (like.toString() === req.user._id.toString()) {
                    isAlreadyLiked = true
                    break
                }
            }
        }
        const userId = new mongoose.Types.ObjectId(req.user._id)
        if (isAlreadyLiked) {
            post.likes.pull(userId)
            await post.save()
            res.status(200).send({ message: "Post disliked."})
        } else {
            post.likes.push(userId)
            await post.save()
            req.notification = {
                recipient: post.author,
                type: 'like',
                fromUser: new mongoose.Types.ObjectId(req.user._id),
                post: post._id
            }
            await sendNotification(req, res)
            res.status(200).send({ message: "Post liked."})
        }
    } catch (error) {
        console.error(new Date(), "Error in liking process post:", error)
        res.status(500).send({ message: "Internal server error!"})
    }
}

/*
    Function that allows user to delete post.
    It checks if the post exists and makes sure that
    user is the author of the post.
 */
const deletePost = async (req, res) => {
    try {
        // store post
        const post = await Post.findById(req.body._id)
        // Post does not exist
        if (!post) {
            return res.status(404).send({ message: "Post not found."})
        }
        // Ensure user is author of the post
        if (post.author.toString() !== req.user._id.toString()) {
            console.error(new Date(), "WARNING: Unauthorized delete attempt! User", req.user, "tried to delete post", req.body._id , "which does not belong to him.")
            return res.status(403).send({ message: "Post does not belong to you!"})
        }

        // Delete post
        await Post.findByIdAndDelete(req.body._id)
        // Delete all comments associated with the post
        await Comment.deleteMany({post: req.body._id})

        // Delete folder with post images
        const uploadPath = path.join(__dirname, "..", "uploads", "images", "posts", req.body._id.toString())
        if (fs.existsSync(uploadPath)) {
            // Delete all files inside
            const files = fs.readdirSync(uploadPath)
            for (const file of files) {
                const filePath = path.join(uploadPath, file)
                if (fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath)
                }
            }
            // Remove the directory itself
            fs.rmdirSync(uploadPath)
        }

        console.log(new Date(), "Post", req.body._id.toString(), "and its images folder have been deleted.")
        return res.status(200).send({ message: "Post deleted."})
    } catch (error) {
        console.error(new Date(), "Error deleting post:", error)
        res.status(500).send({ message: "Internal server error!"})
    }
}

module.exports = { createPost, showPosts, updatePost, likePost, deletePost }