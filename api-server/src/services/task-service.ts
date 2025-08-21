import Task from "../models/task";
import { TaskDocument } from "../interfaces/task-document";
import { TaskInput } from "../interfaces/task-input";

export const createTask = async (taskData: TaskInput): Promise<TaskDocument> => {
    const task = new Task(taskData);

    return await task.save();
};

export const getTasks = async (
    sortBy: string = "dueDate",
    order: 1 | -1 = 1,
    page: number = 1,
    limit: number = 10
): Promise<{ tasks: TaskDocument[]; total: number }> => {
    const filter = { isDeleted: false };
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .populate('assignedTo', 'name')
            .populate('createdBy', 'name')
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit)
        ,
        Task.countDocuments(filter)
    ]);

    return { tasks, total };
};

export const getTaskById = async (id: string): Promise<TaskDocument | null> => {
    return await Task.findOne({ _id: id, isDeleted: false });
};

export const updateTask = async (
    id: string, 
    updateData: Partial<TaskInput>
): Promise<TaskDocument | null> => {

    return await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

export const deleteTask = async (id: string): Promise<TaskDocument | null> => {
    const task = await Task.findById(id);

    if (!task) {
        return null;
    }

    task.isDeleted = true;

    await task.save();

    return task;
};