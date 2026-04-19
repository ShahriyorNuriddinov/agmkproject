const { DataTypes } = require("sequelize"); // D katta harf bilan!
const sequelize = require("../db");

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverLetter: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Yangi",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vacancyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Application;
