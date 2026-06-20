import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { seedDemoUser } from "./utils/seedDemoUser.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TaskFlow API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedDemoUser();
    app.listen(PORT, () => {
      console.log(`TaskFlow API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
