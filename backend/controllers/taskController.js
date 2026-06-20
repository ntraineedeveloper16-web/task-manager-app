import { Op } from "sequelize";
import { Task } from "../models/index.js";

function buildTaskFilters(query, userId) {
  const where = { userId };

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${query.search}%` } },
      { description: { [Op.like]: `%${query.search}%` } },
    ];
  }

  return where;
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.findAll({
      where: buildTaskFilters(req.query, req.user.id),
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
    });

    const stats = {
      total: tasks.length,
      pending: tasks.filter((task) => task.status !== "completed").length,
      underReview: tasks.filter((task) => task.status === "under-review").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    };

    return res.json({ tasks, stats });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.update(req.body);
    return res.json({ task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const deleted = await Task.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}
