const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification topilmadi" });
        }
        await notification.update({ isRead: true });
        res.json({ message: "O'qildi", notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        await Notification.update({ isRead: true }, { where: { userId } });
        res.json({ message: "Hammasi o'qildi" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
