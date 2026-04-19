const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyAdmin = require("../middleware/verifyAdmin");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/check-email", authController.checkEmail);
router.post("/reset-password", authController.resetPassword);
router.post("/create-user", verifyAdmin, authController.createUser);
router.post("/make-admin", authController.makeAdmin);
module.exports = router;
