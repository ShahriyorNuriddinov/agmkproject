const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/:userId", verifyToken, notificationController.getMyNotifications);
router.put(
  "/:userId/read-all",
  verifyToken,
  notificationController.markAllAsRead,
);
router.put("/:id/read", verifyToken, notificationController.markAsRead);

module.exports = router;
