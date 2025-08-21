import { Request, Response } from "express";
import * as taskService from "../services/task-service";
import { storeTaskValidator } from "../validators/store-task-validator";
import { updateTaskValidator } from "../validators/update-task-validator";
import { format } from "date-fns";

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const schema = storeTaskValidator(req.t);
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));

            res.status(400).json({ success: false, message: errors });

            return;
        }
        
        const task = await taskService.createTask(result.data);

        res.status(201).json({ success: true, data: task });
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const allowedSortFields = ["title", "dueDate", "priority", "status"];
        
        const sortBy = allowedSortFields.includes(req.query.sortBy as string)
            ? req.query.sortBy as string
            : "dueDate";

        const order = (req.query.order as string || "asc") === "desc" ? -1 : 1;

        const page = parseInt(req.query.page as string, 10);

        const limit = parseInt(req.query.limit as string, 10);

        const currentPage = isNaN(page) || page < 1 ? 1 : page;

        const perPage = isNaN(limit) || limit < 1 ? 10 : limit;

        const { tasks, total } = await taskService.getTasks(sortBy, order, currentPage, perPage);

        const data = tasks.map((task) => {
            const obj = task.toObject();

            return {
                ...obj,
                statusLabel: req.t(`task.status.${task.status}`),
                priorityLabel: req.t(`task.priority.${task.priority}`),
                assignedToName: obj.assignedTo?.name || null,
                createdByName: obj.createdBy?.name || null,
                dueDate: task.dueDate,
                dueDateFormatted: format(new Date(task.dueDate), 'MM-dd-yyyy'),
            };
        });

        res.status(200).json({ success: true, data, total });
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await taskService.getTaskById(req.params.id);

        if (!task) {
            res.status(400).json({ success: false, message: req.t("task.notFound") });
        } else {
            res.status(200).json({ success: true, data: task });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const taskExists = await taskService.getTaskById(req.params.id);

        if (!taskExists) {
            res.status(404).json({ success: false, message: req.t("task.notFound") });
        } else {
            const schema = updateTaskValidator(req.t);
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

            const task = await taskService.updateTask(req.params.id, result.data);

            res.status(200).json({ success: true, data: task });
        }
    } catch (error: any) {
        console.log('error', error);
        
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await taskService.deleteTask(req.params.id);

        if (!deleted) {
            res.status(400).json({ success: false, message: req.t("task.notFound") });
        } else {
            res.status(200).json({ success: true, data: deleted });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: req.t("internalError") });
    }
};