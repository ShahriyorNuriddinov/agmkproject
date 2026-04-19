const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/", verifyAdmin, userController.getAllUsers);         
router.get("/:id", verifyToken, userController.getProfile);
router.put("/:id", verifyToken, userController.updateProfile);
router.delete("/:id", verifyAdmin, userController.deleteUser);    

module.exports = router;
