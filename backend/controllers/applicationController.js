const Application = require("../models/Application");
const Vacancy = require("../models/Vacancy");
const Notification = require("../models/Notification");
const multer = require("multer");
const User = require("../models/User");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Faqat PDF, DOC yoki DOCX fayl yuklash mumkin"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

exports.uploadMiddleware = upload.single("resume");

exports.applyToJob = async (req, res) => {
  try {
    const { vacancyId, coverLetter } = req.body;
    const userId = req.user.id;
    const resumeUrl = req.file ? req.file.path : null;

    if (!resumeUrl) return res.status(400).json({ error: "Fayl yuklanmadi" });

    const existing = await Application.findOne({ where: { userId, vacancyId } });
    if (existing) return res.status(400).json({ error: "Siz bu vakansiyaga allaqachon ariza topshirgansiz" });

    const application = await Application.create({
      userId,
      vacancyId,
      coverLetter,
      resumeUrl,
    });

    const vacancy = await Vacancy.findByPk(vacancyId);
    if (vacancy) {
      await vacancy.increment("applicationsCount");
      await Notification.create({
        userId: vacancy.userId,
        message: `"${vacancy.title}" vakansiyasiga yangi ariza keldi`,
      });
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getMyApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.findAll({
      where: { userId },
      include: [
        { model: Vacancy, attributes: ["title", "salary", "status"] }
      ],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ error: "Ariza topilmadi" });
    }
    await application.update({ status });
    await Notification.create({
      userId: application.userId,
      message: "Arizangiz bo'yicha habar keldi " + status,
    });
    res.json({ message: "Status yangilandi", application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVacancyApplications = async (req, res) => {
  try {
    const { vacancyId } = req.params;
    const applications = await Application.findAll({
      where: { vacancyId },
      include: [
        { model: User, as: "candidate", attributes: ["fullName", "email"] },
      ],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
