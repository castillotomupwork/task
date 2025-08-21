import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/user-controller";

const usersRoutes = express.Router();

usersRoutes.post("/users", createUser);
usersRoutes.get("/users", getUsers);
usersRoutes.get("/users/:id", getUserById);
usersRoutes.put("/users/:id", updateUser);
usersRoutes.delete("/users/:id", deleteUser);

export default usersRoutes;