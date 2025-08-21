import { Types } from "mongoose";
import { TaskStatus, TaskPriority } from "../enums/task-enums";

export interface TaskInput {
  title: string;
  description?: string | undefined;
  status: TaskStatus;
  dueDate: string | Date;
  priority: TaskPriority;
  assignedTo: string | Types.ObjectId;
  createdBy: string | Types.ObjectId;
  isDeleted?: boolean | undefined;
}