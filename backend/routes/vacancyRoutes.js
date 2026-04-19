const express = require("express");
const router = express.Router();
const vacancyController = require("../controllers/vacancyController");
const verifyToken = require("../middleware/verifyToken");
router.post("/", verifyToken, vacancyController.createVacancy);
router.get("/", vacancyController.getAllVacancies);
router.get("/my/:userId", verifyToken, vacancyController.getMyVacancies);
router.get("/:id", verifyToken, vacancyController.getVacancyById);

module.exports = router;
