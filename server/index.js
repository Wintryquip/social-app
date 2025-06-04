require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path');

// config
const connectDB = require('./config/db')

// middleware
app.use(express.json())
app.use(cors())
app.use(fileUpload(undefined))

// share upload directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// routes
const userRoutes = require("./routes/userRoutes")
app.use("/user", userRoutes)
const postRoutes = require("./routes/postRoutes")
app.use("/post", postRoutes)
const commentRoutes = require("./routes/commentRoutes")
app.use("/comment", commentRoutes)
const notificationRoutes = require("./routes/notificationRoutes")
app.use("/notification", notificationRoutes)

// MongoDB connection
connectDB()

// server
const port = process.env.PORT || 8080
app.listen(port, () => console.log(new Date(), `Server is listening on port ${port}`))
