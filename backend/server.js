const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./db");
const User = require("./models/User");
const Vacancy = require("./models/Vacancy");
const Application = require("./models/Application");
const Notification = require("./models/Notification");
const Profile = require("./models/profile");
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const vacancyRoutes = require("./routes/vacancyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

User.hasMany(Vacancy, { foreignKey: "userId", as: "vacancies" });
Vacancy.belongsTo(User, { foreignKey: "userId", as: "hr" });

User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId", as: "candidate" });

Vacancy.hasMany(Application, { foreignKey: "vacancyId" });
Application.belongsTo(Vacancy, { foreignKey: "vacancyId" });

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });


User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

app.use("/api/auth", authRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend ${PORT} portda ishga tushdi!`));
});
