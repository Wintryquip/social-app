require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const fileUpload = require('express-fileupload')
const path = require('path');

// config
const connectDB = require('./config/db')

// middleware
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(fileUpload(undefined))
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB,
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        secure: false, // true if https
        sameSite: 'lax', // 'none' if https + cross-origin
        maxAge: 1000 * 60 * 60 * 2 // 1 day
    }
}))

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
