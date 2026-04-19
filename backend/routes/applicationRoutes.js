const express = require("express");
const router = express.Router();
const appController = require("../controllers/applicationController");
const verifyToken = require("../middleware/verifyToken");
router.get(
  "/vacancy/:vacancyId",
  verifyToken,
  appController.getVacancyApplications,
);

router.get("/my/:userId", verifyToken, appController.getMyApplications);

router.post(
  "/apply",
  verifyToken,
  (req, res, next) => {
    appController.uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  appController.applyToJob,
);
router.put("/:id/status", verifyToken, appController.updateStatus);

module.exports = router;
