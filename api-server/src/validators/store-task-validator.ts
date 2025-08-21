import { z } from "zod";
import { TFunction } from "i18next";
import { TaskStatus, TaskStatusValues, TaskPriority, TaskPriorityValues } from "../enums/task-enums";
import { getUserById } from "../services/user-service";
import mongoose from "mongoose";

export const storeTaskValidator = (t: TFunction) => 
    z.object({
        title: z
            .string({ 
                required_error: t("task.validation.title.required"),
            })
            .trim()
            .min(1, { message: t("task.validation.title.required") })
        ,

        description: z
            .string()
            .optional()
        ,

        status: z
            .string({ required_error: t("task.validation.status.required") })
            .superRefine((val, contx) => {
                if (!TaskStatusValues.includes(val as any)) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["priority"],
                        message: t("task.validation.status.invalid"),
                    });
                }
            }) as z.ZodType<TaskStatus>
        ,

        dueDate: z
            .string({ 
                required_error: t("task.validation.dueDate.required"),
            })
            .superRefine((val, contx) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["dueDate"],
                        message: t("task.validation.dueDate.format"),
                    });

                    return;
                }

                const [year, month, day] = val.split("-").map(Number);
                const due = new Date(year, month - 1, day);

                if (
                    due.getFullYear() !== year ||
                    due.getMonth() !== month - 1 ||
                    due.getDate() !== day
                ) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["dueDate"],
                        message: t("task.validation.dueDate.invalid"),
                    });

                    return;
                }

                const today = new Date();

                due.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                if (due < today) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["dueDate"],
                        message: t("task.validation.dueDate.future"),
                    });
                }
            })
        ,

        priority: z
            .string({ required_error: t("task.validation.priority.required") })
            .superRefine((val, contx) => {
                if (!TaskPriorityValues.includes(val as any)) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["priority"],
                        message: t("task.validation.priority.invalid"),
                    });
                }
            }) as z.ZodType<TaskPriority>
        ,

        assignedTo: z
            .string({ 
                required_error: t("task.validation.assignedTo.required"),
            })
            .superRefine(async (val, contx) => {
                if (!val) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["assignedTo"],
                        message: t("task.validation.assignedTo.required"),
                    });

                    return;
                }

                if (!mongoose.Types.ObjectId.isValid(val)) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["assignedTo"],
                        message: t("task.validation.assignedTo.invalid"),
                    });

                    return;
                }

                const user = await getUserById(val);

                if (!user) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["assignedTo"],
                        message: t("task.validation.assignedTo.notFound"),
                    });
                }
            })
        ,

        createdBy: z
            .string({ 
                required_error: t("task.validation.createdBy.required"),
            })
            .superRefine(async (val, contx) => {
                if (!val) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["createdBy"],
                        message: t("task.validation.createdBy.required"),
                    });

                    return;
                }

                if (!mongoose.Types.ObjectId.isValid(val)) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["createdBy"],
                        message: t("task.validation.createdBy.invalid"),
                    });

                    return;
                }

                const user = await getUserById(val);

                if (!user) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["createdBy"],
                        message: t("task.validation.createdBy.notFound"),
                    });
                }
            })
        ,
    });