const express = require("express")
const router = express.Router()
const { auth } = require("../controllers/userController")
const { showNotifications, setReadNotifications } = require("../controllers/notificationController")

router.get("/show", auth, showNotifications)
router.patch("/read", auth, setReadNotifications)

module.exports = router