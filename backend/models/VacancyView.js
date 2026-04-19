const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const VacancyView = sequelize.define("VacancyView", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  VacancyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
module.exports = VacancyView;
