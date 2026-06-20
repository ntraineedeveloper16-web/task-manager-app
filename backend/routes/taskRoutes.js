import express from "express";
import { body, param, query } from "express-validator";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleValidation } from "../utils/validation.js";

const router = express.Router();

const statuses = ["todo", "in-progress", "under-review", "completed"];
const priorities = ["low", "medium", "high"];

router.use(protect);

router.get(
  "/",
  [
    query("status").optional().isIn(statuses),
    query("priority").optional().isIn(priorities),
    query("search").optional().trim(),
  ],
  handleValidation,
  getTasks
);

router.post(
  "/",
  [
    body("title").trim().isLength({ min: 2 }).withMessage("Title must be at least 2 characters"),
    body("description").optional({ values: "falsy" }).trim(),
    body("status").optional().isIn(statuses),
    body("priority").optional().isIn(priorities),
    body("dueDate").optional({ values: "falsy" }).isISO8601().toDate(),
  ],
  handleValidation,
  createTask
);

router.put(
  "/:id",
  [
    param("id").isInt(),
    body("title").optional().trim().isLength({ min: 2 }),
    body("description").optional({ values: "falsy" }).trim(),
    body("status").optional().isIn(statuses),
    body("priority").optional().isIn(priorities),
    body("dueDate").optional({ values: "falsy" }).isISO8601().toDate(),
  ],
  handleValidation,
  updateTask
);

router.delete("/:id", [param("id").isInt()], handleValidation, deleteTask);

export default router;
