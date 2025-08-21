import z from "zod";

export const TaskStatusEnum = z.enum(["pending", "in-progress", "completed"]);
export const TaskStatusValues = TaskStatusEnum.options;
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

export const TaskPriorityEnum = z.enum(["low", "medium", "high"]);
export const TaskPriorityValues = TaskPriorityEnum.options;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;