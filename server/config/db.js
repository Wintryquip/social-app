const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB)
        console.log(new Date(), "Connected to MongoDB.")
    } catch (err) {
        console.error(new Date(), "Connection error with MongoDB:", err.message)
        process.exit(1)
    }
}

module.exports = connectDB;