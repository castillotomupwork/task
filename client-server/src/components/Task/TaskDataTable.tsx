import * as React from "react";
import type { TaskData } from "../../interfaces/taskData";
import DataTable, { type TableColumn } from "react-data-table-component";
import { PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface ITaskDataTableProps {
    data: TaskData[];
    onSort: (column: any, direction: "asc" | "desc") => void;
    totalRows: number;
    onChangePage: (page: number) => void;
    onChangeRowsPerPage: (perPage: number, page: number) => void;
    sendFormData: (task: TaskData) => void;
    sendDelete: (task: TaskData) => void;
}

const TaskDataTable: React.FunctionComponent<ITaskDataTableProps> = ({ 
    data, 
    onSort, 
    totalRows, 
    onChangePage, 
    onChangeRowsPerPage,
    sendFormData,
    sendDelete
}) => {
    const { t } = useTranslation();

    const columns: TableColumn<TaskData>[] = [
        {
            name: t("task.title"),
            selector: (row: TaskData) => row.title,
            sortable: true,
            grow: 2,
        },
        {
            name: t("task.status"),
            selector: (row: TaskData) => row.statusLabel || "",
            sortable: true,
        },
        {
            name: t("task.priority"),
            selector: (row: TaskData) => row.priorityLabel || "",
            sortable: true,
        },
        {
            name: t("task.dueDate"),
            selector: (row: TaskData) => new Date(row.dueDate).getTime(),
            cell: (row: TaskData) => row.dueDateFormatted,
            sortable: true,
        },
        {
            name: t("task.assignedTo"),
            selector: (row: TaskData) => row.assignedToName || "",
            sortable: true,
        },
        {
            name: t("task.createdBy"),
            selector: (row: TaskData) => row.createdByName || "",
            sortable: true,
        },
        {
            name: t("task.actions"),
            cell: (row: TaskData) => (
                <div className="flex space-x-2">
                    <button 
                        className="text-gray-600 hover:text-blue-400 cursor-pointer"
                        onClick={() => triggerEdit(row)}
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>

                    <button 
                        className="text-gray-600 hover:text-red-400 cursor-pointer"
                        onClick={() => triggerDelete(row)}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                fontSize: "1rem",
                textTransform: "uppercase" as const,
                color: "#1f2937",
                background: "linear-gradient(to bottom, #d1d5db, #9ca3af)",
            },
        },

        headCells: {
            style: {
                fontWeight: "bold",
                paddingTop: "12px",
                paddingBottom: "12px",
            },
        },

        rows: {
            style: {
                borderBottom: "1px solid #d1d5db",
                color: "#1f2937",
                background: "linear-gradient(to bottom, #f3f4f6, #e5e7eb)",
                transition: "background 0.3s ease",
            },
            highlightOnHoverStyle: {
                background: "linear-gradient(to bottom, #d1d5db, #e5e7eb)",
                color: "#1f2937",
                outline: "none",
            },
        },
    };

    const paginationOptions = {
        rowsPerPageText: t("dataTable.rowsPerPage"),
        rangeSeparatorText: t("dataTable.of"),
        selectAllRowsItem: true,
        selectAllRowsItemText: t("dataTable.all"),
    };

    const triggerEdit = (task: TaskData) => {
        sendFormData(task);
    };

    const triggerDelete = (task: TaskData) => {
        sendDelete(task);
    };

    return (
        <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            highlightOnHover
            noDataComponent={t("task.noTask")}
            onSort={onSort}
            pagination
            paginationServer 
            paginationComponentOptions={paginationOptions}
            paginationTotalRows={totalRows}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
        />
    );
};

export default TaskDataTable;