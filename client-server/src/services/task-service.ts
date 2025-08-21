import i18n from "../i18n";
import axios from "axios";
import { serverUrl } from "../helpers/Constants";
import type { TaskData } from "../interfaces/taskData";

const emptyTaskData: TaskData = {
    _id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "pending",
    assignedTo: "",
    createdBy: "",
    assignedToName: "",
    createdByName: "",
    dueDateFormatted: "",
};

export const getTasks = async(
    field: string = "",
    order: "asc" | "desc" = "asc",
    page: number = 1,
    limit: number = 10
): Promise<{ 
    data: TaskData[];
    total: number;
    error: string;
}> => {
    try {
        const response = await axios.get(`${serverUrl}/tasks`, {
            params: {
                sortField: field,
                sortOrder: order,
                page: page,
                limit: limit,
            },
            headers: {
                "Accept-Language": i18n.language
            }
        });

        if (response.data.success === true) {
            return {
                data: response.data.data,
                total: response.data.total,
                error: "",
            };
        }

        return {
            data: [],
            total: 0,
            error: response.data.message,
        };
        
    } catch (error: any) {
        return {
            data: [],
            total: 0,
            error: i18n.t("systemError"),
        };
    }
};

export const createTask = async(task: TaskData): Promise<{
    data: TaskData;
    error: string;
}> => {
    try {
        const response = await axios.post(`${serverUrl}/tasks`, task,
            {
                headers: {
                    "Accept-Language": i18n.language
                }
            }
        );

        if (response.data.success === true) {
            return {
                data: response.data.data,
                error: "",
            };
        }

        return {
            data: emptyTaskData,
            error: response.data.message || i18n.t("task.failedCreate"),
        };
    } catch (error: any) {
        const statusCode = error.response?.status;

        if (statusCode === 400) {
            return {
                data: emptyTaskData,
                error: error?.response?.data?.message,
            };
        }

        return {
            data: emptyTaskData,
            error: i18n.t("systemError"),
        };
    }
};

export const updateTask = async(task: TaskData): Promise<{
    data: TaskData;
    error: string;
}> => {
    try {
        const response = await axios.put(`${serverUrl}/tasks/${task._id}`, task,
            {
                headers: {
                    "Accept-Language": i18n.language
                }
            }
        );

        if (response.data.success === true) {
            return {
                data: response.data.data,
                error: "",
            };
        }

        return {
            data: emptyTaskData,
            error: response.data.message || i18n.t("task.failedUpdate"),
        };
    } catch (error: any) {
        const statusCode = error.response?.status;

        if (statusCode === 400) {
            return {
                data: emptyTaskData,
                error: error?.response?.data?.message,
            };
        }

        return {
            data: emptyTaskData,
            error: i18n.t("systemError"),
        };
    }
};

export const deleteTask = async(task: TaskData): Promise<{
    success: boolean;
    error: string;
}> => {
    try {
        const response = await axios.delete(`${serverUrl}/tasks/${task._id}`,
            {
                headers: {
                    "Accept-Language": i18n.language
                }
            }
        );

        if (response.data.success === true) {
            return {
                success: true,
                error: "",
            };
        }

        return {
            success: false,
            error: response.data.message || i18n.t("task.failedDelete"),
        };
    } catch (error: any) {
        return {
            success: false,
            error: i18n.t("systemError"),
        };
    }
};