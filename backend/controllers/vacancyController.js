const Vacancy = require("../models/Vacancy");
const User = require("../models/User");
const VacancyView = require("../models/VacancyView");

exports.createVacancy = async (req, res) => {
  try {
    const { title, description, requirements, salary, status } = req.body;
    const userId = req.user.id;
    const vacancy = await Vacancy.create({ title, description, requirements, salary, status, userId });
    res.status(201).json({ message: "Muvaffaqiyatli e'lon qilindi", vacancy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyVacancies = async (req, res) => {
  try {
    const { userId } = req.params;
    const vacancies = await Vacancy.findAll({ where: { userId } });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVacancyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const vacancy = await Vacancy.findByPk(id, {
      include: [{ model: User, as: 'hr', attributes: ['fullName'] }],
    });

    if (!vacancy) return res.status(404).json({ error: "Vakansiya topilmadi!" });

    if (userId) {
      const alreadyViewed = await VacancyView.findOne({ where: { userId, VacancyId: id } });
      if (!alreadyViewed) {
        await VacancyView.create({ userId, VacancyId: id });
        await vacancy.increment("views");
      }
    }

    res.json(vacancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.findAll({
      include: [{ model: User, as: "hr", attributes: ["fullName"] }],
    });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
