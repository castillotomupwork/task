import express from "express";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} from "../controllers/task-controller";

const taskRoutes = express.Router();

taskRoutes.post("/tasks", createTask);
taskRoutes.get("/tasks", getTasks);
taskRoutes.get("/tasks/:id", getTaskById);
taskRoutes.put("/tasks/:id", updateTask);
taskRoutes.delete("/tasks/:id", deleteTask);

export default taskRoutes;