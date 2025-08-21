import mongoose, { Document } from "mongoose";
import { TaskInput } from "./task-input";

export interface TaskDocument extends TaskInput, Document {
    _id: string;
    createdAt?: Date;
    updatedAt?: Date;
};