import * as React from "react";
import type { TaskData } from "../../interfaces/taskData";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { createTask, updateTask } from "../../services/task-service";
import { getUsersOptions } from "../../services/user-service";
import type { UserData } from "../../interfaces/userData";
import { useAutoHideMessage } from "../../helpers/AutoHideMessage";
import { useTranslation } from "react-i18next";
import LoadingOverlay from "../../helpers/LoadingOverlay";

interface ITaskFormProps {
    data: TaskData | null;
}

const TaskForm: React.FunctionComponent<ITaskFormProps> = ({ data }) => {
    const { t } = useTranslation();
    const todayDate = new Date();
    const [task, setTask] = React.useState({
        _id: "",
        title: "",
        description: "",
        dueDate: todayDate as Date | string,
        priority: "low" as "low" | "medium" | "high",
        status: "pending" as "pending" | "in-progress" | "completed",
        assignedTo: "",
        createdBy: ""
    });
    const [error, setError] = React.useState({
        title: "",
        dueDate: "",
        priority: "",
        status: "",
        assignedTo: "",
        createdBy: ""
    });
    const { message, showMessage, fadeOut } = useAutoHideMessage();
    const [users, setUsers] = React.useState<UserData[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setTask({
            _id: data?._id || "",
            title: data?.title || "",
            description: data?.description || "",
            status: data?.status || "pending",
            dueDate: data?.dueDate 
                ? format(data.dueDate, "yyyy-MM-dd") 
                : format(todayDate, "yyyy-MM-dd"),
            priority: data?.priority || "low",
            assignedTo: getId(data?.assignedTo),
            createdBy: getId(data?.createdBy)
        });

        setError({
            title: "",
            dueDate: "",
            priority: "",
            status: "",
            assignedTo: "",
            createdBy: ""
        });

        if (data?.title) {
            document.title = `Demo | ${data?.title || ""}`;
        } else {
            document.title = `Demo | ${t("task.newTask")}`;
        }

        loadUsers();

    }, [data]);

    const updateField = <fieldName extends keyof typeof task>(
        field: fieldName, 
        value: typeof task[fieldName]
    ) => {
        setTask(prev => {
            if (prev[field] !== value) {
                setError(prevError => ({
                    ...prevError,
                    [field]: ""
                }));
            }

            return { ...prev, [field]: value };
        });
    };

    const updateErrorField = (
        errors: {
            field: keyof typeof error;
            message: string;
        }[]
    ) => {
        setError(prev => {
            const updated = { ...prev };

            errors.forEach(err => {
                updated[err.field] = err.message;
            });

            return updated;
        });
    }

    const loadUsers = async () => {
        setLoading(true);

        const result = await getUsersOptions();
        if (!result.error) {
            setUsers(result.data);
        } else {
            console.error(`${t("task.errors.users")}:`, result.error);
        }

        setLoading(false);
    };


    const getId = (user: string | { _id: string } | undefined) => {
        return typeof user === "object" && user !== null ? user._id : "";
    };

    const updateDueDate = (date: Date | null) => {
        if (!date) {
            updateField("dueDate", todayDate);
        } else {
            updateField("dueDate", date);
        }
    };

    const convertLocalFormat = (date: string | Date | undefined) => {
        if (!date) {
            return new Date(todayDate);
        }

        return typeof date === "string" ? new Date(date) : date;
    };

    const convertDBFormat = (date: string | Date | undefined): string => {
        const d = date ? (typeof date === "string" ? new Date(date) : date) : new Date();

        return format(d, "yyyy-MM-dd");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        
        e.preventDefault();

        setError({
            title: "",
            dueDate: "",
            priority: "",
            status: "",
            assignedTo: "",
            createdBy: ""
        });

        let formData: TaskData = task;

        formData.dueDate = convertDBFormat(formData.dueDate);

        let successMessage = "";
        let result;

        if (formData._id != "") {
            result = await updateTask(formData);

            successMessage = t("task.updated");
        } else {
            result = await createTask(formData);

            successMessage = t("task.created");
        }
        

        if (result?.error) {
            if (Array.isArray(result.error)) {
                updateErrorField(result.error);

                setLoading(false);

                return;
            }

            showMessage(result.error, "error");

            setLoading(false);
            
            return;
        }

        showMessage(successMessage, "success");

        setLoading(false);
    };

    return (
        <>
            <div className="container p-2 mx-auto">
                {message && (
                    <div 
                        className={`p-2 mb-2 text-sm rounded transition-all duration-1000 max-h-40 overflow-hidden 
                            ${fadeOut ? "opacity-0 max-h-0 p-0" : "opacity-100"}
                            ${message.type === "success" ? "bg-green-100" : "bg-red-100"}`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("task.title")}
                        </label>
                        <input
                            type="text"
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={task.title}
                            onChange={(e) => updateField("title", e.target.value)}
                        />
                        {error.title && <small className="text-red-500">{error.title}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("task.description")}
                        </label>
                        <textarea
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            rows={4}
                            value={task.description}
                            onChange={(e) => updateField("description", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("task.dueDate")}
                        </label>
                        <DatePicker
                            selected={convertLocalFormat(task.dueDate)}
                            onChange={updateDueDate}
                            dateFormat="MM-dd-yyyy"
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        {error.dueDate && <div><small className="text-red-500">{error.dueDate}</small></div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("task.priority")}
                        </label>
                        <select
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={task.priority}
                            onChange={(e) => updateField("priority", e.target.value as "low" | "medium" | "high")}
                        >
                            <option value="low">{t("task.low")}</option>
                            <option value="medium">{t("task.medium")}</option>
                            <option value="high">{t("task.high")}</option>
                        </select>
                        {error.priority && <small className="text-red-500">{error.priority}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("task.status")}
                        </label>
                        <select
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={task.status}
                            onChange={(e) => updateField("status", e.target.value as "pending" | "in-progress" | "completed")}
                        >
                            <option value="pending">{t("task.pending")}</option>
                            <option value="in-progress">{t("task.inProgress")}</option>
                            <option value="completed">{t("task.completed")}</option>
                        </select>
                        {error.status && <small className="text-red-500">{error.status}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("task.assignedTo")}
                        </label>
                        <select
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={task.assignedTo}
                            onChange={(e) => updateField("assignedTo", e.target.value)}
                        >
                            <option value="">-- {t("task.selectUser")} --</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        {error.assignedTo && <small className="text-red-500">{error.assignedTo}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("task.createdBy")}
                        </label>
                        <select
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={task.createdBy}
                            onChange={(e) => updateField("createdBy", e.target.value)}
                        >
                            <option value="">-- {t("task.selectUser")} --</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        {error.createdBy && <small className="text-red-500">{error.createdBy}</small>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="border border-gray-600 text-gray-600 font-bold px-4 py-1 rounded hover:bg-gray-600 hover:border-gray-600 hover:text-white transition cursor-pointer"
                        >
                            {data ? t("task.updateTask") : t("task.createTask")}
                        </button>
                    </div>
                </form>
            </div>

            <LoadingOverlay show={loading} />
        </>
    );
};

export default TaskForm;