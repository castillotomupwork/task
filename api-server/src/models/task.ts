import mongoose, { Schema } from "mongoose";
import { TaskDocument } from "../interfaces/task-document";
import { TaskPriorityValues, TaskStatusValues } from "../enums/task-enums";

const TaskSchema = new Schema<TaskDocument>(
    {
        title: { 
            type: String, 
            required: true, 
        },
        description: { 
            type: String,
        },
        status: { 
            type: String, 
            enum: TaskStatusValues, 
            default: TaskStatusValues[0],
        },
        dueDate: { 
            type: Date, 
            required: true, 
        },
        priority: { 
            type: String, 
            enum: TaskPriorityValues, 
            default: TaskPriorityValues[0], 
        },
        assignedTo: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true, 
        },
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true, 
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<TaskDocument>("Task", TaskSchema);