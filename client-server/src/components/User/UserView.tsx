import * as React from "react";
import type { UserData } from "../../interfaces/userData";
import UserDataTable from "./UserDataTable";
import { getUsers, deleteUser } from "../../services/user-service";
import LoadingOverlay from "../../helpers/LoadingOverlay";
import { useAutoHideMessage } from "../../helpers/AutoHideMessage";
import { useTranslation } from "react-i18next";

export interface UserViewRef {
    refresh: () => void;
}

interface IUserViewContainerProps {
    sendChangeContent: (module: "users", container: "view" | "form", data: UserData | null) => void;
}

const UserView = React.forwardRef<UserViewRef, IUserViewContainerProps>(({ sendChangeContent }, ref) => {
    const { t } = useTranslation();
    const [data, setData] = React.useState<UserData[]>([]);
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

        const result = await getUsers(field, order, page, limit);

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
        document.title = `Demo | ${t("user.user")}`;
        
        getTableData(sortField, sortOrder, currentPage, perPage);
    }, []);

    const handleSort = (column: { selector: (row: UserData) => any; name: string }, direction: "asc" | "desc") => {
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

    const receiveFormData = (user: UserData) => {
        sendChangeContent("users", "form", user);
    };

    const handleDelete = async (user: UserData) => {
        setLoading(true);

        const result = await deleteUser(user);

        setLoading(false);

        if (result?.error) {
            showMessage(result.error, "error");

            return;
        }

        showMessage(t("user.deleted"), "success");
        
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
                
                <UserDataTable
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

export default UserView;