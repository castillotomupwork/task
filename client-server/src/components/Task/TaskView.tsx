import * as React from "react";
import type { TaskData } from "../../interfaces/taskData";
import TaskDataTable from "./TaskDataTable";
import { getTasks, deleteTask } from "../../services/task-service";
import LoadingOverlay from "../../helpers/LoadingOverlay";
import { useAutoHideMessage } from "../../helpers/AutoHideMessage";
import { useTranslation } from "react-i18next";

export interface TaskViewRef {
    refresh: () => void;
}

interface ITaskViewContainerProps {
    sendChangeContent: (module: "tasks", container: "view" | "form", data: TaskData | null) => void;
}

const TaskView = React.forwardRef<TaskViewRef, ITaskViewContainerProps>(({ sendChangeContent }, ref) => {
    const { t } = useTranslation();
    const [data, setData] = React.useState<TaskData[]>([]);
    const [sortField, setSortField] = React.useState<string>("");
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
    const [totalRows, setTotalRows] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const { message, showMessage, fadeOut } = useAutoHideMessage();
    const [loading, setLoading] = React.useState(false);

    const getTableData = async (
        field = "", 
        order: "asc" | "desc" = "asc",
        page = 1,
        limit = 10
    ) => {
        setLoading(true);

        const result = await getTasks(field, order, page, limit);

        setLoading(false);

        if (result?.error) {
            showMessage(result.error, "error");

            return;
        }

        setData(result.data);

        setTotalRows(result.total);
    };

    React.useImperativeHandle(ref, () => ({
        refresh() {
            getTableData(sortField, sortOrder, currentPage, perPage);
        }
    }));

    React.useEffect(() => {
        document.title = `Demo | ${t("task.task")}`;
        
        getTableData(sortField, sortOrder, currentPage, perPage);
    }, []);

    const handleSort = (column: { selector: (row: TaskData) => any; name: string }, direction: "asc" | "desc") => {
        if (column.name) {
            const field = toCamelCase(column.name);

            setSortField(field);
            setSortOrder(direction);
            getTableData(field, direction, 1, perPage);
        }
    };

    const toCamelCase = (str: string) => {
        return str
            .toLowerCase()
            .split(" ")
            .map((word, index) => {
                if (index === 0) {
                    return word;
                }

                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join("");
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        getTableData(sortField, sortOrder, page, perPage);
    };

    const handlePerPageChange = (newPerPage: number, page: number) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        getTableData(sortField, sortOrder, page, newPerPage);
    };

    const receiveFormData = (task: TaskData) => {
        sendChangeContent("tasks", "form", task);
    };

    const handleDelete = async (task: TaskData) => {
        setLoading(true);

        const result = await deleteTask(task);

        setLoading(false);

        if (result?.error) {
            showMessage(result.error, "error");

            return;
        }

        showMessage(t("task.deleted"), "success");
        
        getTableData(sortField, sortOrder, currentPage, perPage);
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
                
                <TaskDataTable
                    data={data} 
                    onSort={handleSort}
                    totalRows={totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerPageChange}
                    sendFormData={receiveFormData}
                    sendDelete={handleDelete}
                />
            </div>

            <LoadingOverlay show={loading} />
        </>
    );
});

export default TaskView;