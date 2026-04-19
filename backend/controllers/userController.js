const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });
        if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, password } = req.body;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        await user.update(updateData);
        res.json({ message: "Profil yangilandi", user: { id: user.id, fullName: user.fullName, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        if (user.role === "ADMIN") return res.status(403).json({ error: "Adminni o'chirish mumkin emas" });
        await user.destroy();
        res.json({ message: "Foydalanuvchi o'chirildi" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
