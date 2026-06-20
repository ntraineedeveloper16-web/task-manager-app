import sequelize from "../config/database.js";
import User from "./User.js";
import Task from "./Task.js";

User.hasMany(Task, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
});

export { sequelize, User, Task };
