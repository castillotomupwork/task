export interface TaskData {
    _id: string;
    title: string;
    description: string;
    status?: "pending" | "in-progress" | "completed";
    statusLabel?: string;
    dueDate: Date | string;
    dueDateFormatted?: string;
    priority?: "low" | "medium" | "high";
    priorityLabel?: string;
    assignedTo?: string | { _id : string };
    assignedToName?: string;
    createdBy?: string | { _id : string };
    createdByName?: string;
    isDeleted?: boolean | undefined;
}