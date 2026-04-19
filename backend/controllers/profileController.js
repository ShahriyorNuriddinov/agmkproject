const Profile = require("../models/profile");
const User = require("../models/User");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const docTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (file.fieldname === "avatar" && imageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else if (file.fieldname === "resume" && docTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Avatar uchun JPG/PNG/WEBP, resume uchun PDF/DOC/DOCX yuklang"), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

exports.uploadMiddleware = upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
]);

exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(404).json({ error: "Profil topilmadi" });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.upsertProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { phone, city, birthDate, currentJob, position, experience, skills, bio, department } = req.body;

        const avatarUrl = req.files?.avatar ? req.files.avatar[0].path : undefined;
        const resumeUrl = req.files?.resume ? req.files.resume[0].path : undefined;

        const updateData = { phone, city, birthDate, currentJob, position, experience, skills, bio, department };
        if (avatarUrl) updateData.avatarUrl = avatarUrl;
        if (resumeUrl) updateData.resumeUrl = resumeUrl;

        const [profile, created] = await Profile.findOrCreate({
            where: { userId },
            defaults: { userId, ...updateData },
        });

        if (!created) {
            await profile.update(updateData);
        }

        res.json({ message: "Profil saqlandi", profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
