const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Profile = sequelize.define("Profile", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    birthDate: {
        type: DataTypes.DATEONLY,
    },
    currentJob: {
        type: DataTypes.STRING,
    },
    position: {
        type: DataTypes.STRING,
    },
    experience: {
        type: DataTypes.INTEGER,
    },
    skills: {
        type: DataTypes.STRING,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    avatarUrl: {
        type: DataTypes.STRING,
    },
    resumeUrl: {
        type: DataTypes.STRING,
    },
    department: {
        type: DataTypes.STRING,
    },
});

module.exports = Profile;
