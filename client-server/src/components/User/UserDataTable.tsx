import * as React from "react";
import type { UserData } from "../../interfaces/userData";
import DataTable, { type TableColumn } from "react-data-table-component";
import { PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface IUserDataTableProps {
    data: UserData[];
    onSort: (column: any, direction: "asc" | "desc") => void;
    totalRows: number;
    onChangePage: (page: number) => void;
    onChangeRowsPerPage: (perPage: number, page: number) => void;
    sendFormData: (user: UserData) => void;
    sendDelete: (user: UserData) => void;
}

const UserDataTable: React.FunctionComponent<IUserDataTableProps> = ({
    data, 
    onSort, 
    totalRows, 
    onChangePage, 
    onChangeRowsPerPage,
    sendFormData,
    sendDelete
}) => {
    const { t } = useTranslation();

    const columns: TableColumn<UserData>[] = [
        {
            name: t("user.name"),
            selector: (row: UserData) => row.name,
            sortable: true,
        },
        {
            name: t("user.username"),
            selector: (row: UserData) => row.username,
            sortable: true,
        },
        {
            name: t("user.email"),
            selector: (row: UserData) => row.email,
            sortable: true,
        },
        {
            name: t("user.isDeleted"),
            selector: (row: UserData) => row.isDeleted ? true : false,
            cell: (row: UserData) => row.isDeleted ? t("user.isDeletedYes") : t("user.isDeletedNo"),
            sortable: true,
        },
        {
            name: t("user.actions"),
            cell: (row: UserData) => (
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
        }
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

    const triggerEdit = (user: UserData) => {
        sendFormData(user);
        console.log("User Edit", user);
    };

    const triggerDelete = (user: UserData) => {
        sendDelete(user);
        console.log("User Delete", user);
    };

    return (
        <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            highlightOnHover
            noDataComponent={t("user.noUser")}
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

export default UserDataTable;