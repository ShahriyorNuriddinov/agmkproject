const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Vacancy = sequelize.define("Vacancy", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  requirements: { type: DataTypes.TEXT },
  salary: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: "OPEN" },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  applicationsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Vacancy;
