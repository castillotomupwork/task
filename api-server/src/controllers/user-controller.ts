import { Request, Response } from "express";
import * as userService from "../services/user-service";
import { storeUserValidator } from "../validators/store-user-validator";
import { updateUserValidator } from "../validators/update-user-validator";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const schema = storeUserValidator(req.t);
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));

            res.status(400).json({ success: false, message: errors });

            return;
        }

        const user = await userService.createUser(result.data);

        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getUsers();

        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            res.status(400).json({ success: false, message: req.t("user.notFound") });
        } else {
            res.status(200).json({ success: true, data: user });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userExists = await userService.getUserById(req.params.id);
        
        if (!userExists) {
            res.status(404).json({ success: false, message: req.t("user.notFound") });
        } else {
            const schema = updateUserValidator(req.t);
            const result = await schema.safeParseAsync({
                ...req.body,
                id: req.params.id,
            });

            if (!result.success) {
                const errors = result.error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                }));

                res.status(400).json({ success: false, message: errors });

                return;
            }

            const user = await userService.updateUser(req.params.id, result.data);
        
            res.status(200).json({ success: true, data: user });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await userService.deleteUser(req.params.id);

        if (!deleted) {
            res.status(404).json({ success: false, message: req.t("user.notFound") });
        } else {
            res.status(200).json({ success: true, data: deleted });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};