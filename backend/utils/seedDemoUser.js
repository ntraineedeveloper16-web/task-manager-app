import { Task, User } from "../models/index.js";

export async function seedDemoUser() {
  const [user] = await User.findOrCreate({
    where: { email: "bhavana@gmail.com" },
    defaults: {
      name: "Bhavana M C",
      email: "bhavana@gmail.com",
      password: "bhavana@123",
    },
  });

  const taskCount = await Task.count({ where: { userId: user.id } });

  if (taskCount === 0) {
    await Task.bulkCreate([
      {
        title: "Design Kanban workflow",
        description: "Prepare the task stages and workspace layout.",
        status: "todo",
        priority: "high",
        dueDate: new Date(),
        userId: user.id,
      },
      {
        title: "Connect authentication API",
        description: "Use JWT token persistence for protected routes.",
        status: "in-progress",
        priority: "medium",
        userId: user.id,
      },
      {
        title: "Review dashboard metrics",
        description: "Confirm total, pending, review, and completed counts.",
        status: "under-review",
        priority: "medium",
        userId: user.id,
      },
      {
        title: "Ship responsive UI",
        description: "Validate desktop and mobile workspace behavior.",
        status: "completed",
        priority: "low",
        userId: user.id,
      },
    ]);
  }
}
