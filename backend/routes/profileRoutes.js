const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const verifyToken = require("../middleware/verifyToken");

router.get("/:userId", verifyToken, profileController.getProfile);

router.post("/:userId", verifyToken, (req, res, next) => {
    profileController.uploadMiddleware(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, profileController.upsertProfile);

module.exports = router;
