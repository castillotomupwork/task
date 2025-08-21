import * as React from "react";
import type { UserData } from "../../interfaces/userData";
import { createUser, updateUser } from "../../services/user-service";
import { useAutoHideMessage } from "../../helpers/AutoHideMessage";
import { useTranslation } from "react-i18next";
import LoadingOverlay from "../../helpers/LoadingOverlay";

interface IUserFormProps {
    data: UserData | null;
}

const UserForm: React.FunctionComponent<IUserFormProps> = ({ data }) => {
    const { t } = useTranslation();
    const [user, setUser] = React.useState({
        _id: "",
        name: "",
        username: "",
        email: "",
        password: "",
        isDeleted: false
    });
    const [error, setError] = React.useState({
        name: "",
        username: "",
        email: "",
        password: "",
        isDeleted: ""
    });
    const { message, showMessage, fadeOut } = useAutoHideMessage();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setUser({
            _id: data?._id || "",
            name: data?.name || "",
            username: data?.username || "",
            email: data?.email || "",
            password: "",
            isDeleted: data?.isDeleted || false
        });

        setError({
            name: "",
            username: "",
            email: "",
            password: "",
            isDeleted: ""
        });

        if (data?.name) {
            document.title = `Demo | ${data?.name || ""}`;
        } else {
            document.title = `Demo | ${t("user.newUser")}`;
        }
    }, [data]);

    const updateField = <fieldName extends keyof typeof user>(
        field: fieldName, 
        value: typeof user[fieldName]
    ) => {
        setUser(prev => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        
        e.preventDefault();

        setError({
            name: "",
            username: "",
            email: "",
            password: "",
            isDeleted: ""
        });

        let formData: UserData = user;
        let successMessage = "";
        let result;

        if (formData._id != "") {
            result = await updateUser(formData);

            successMessage = t("user.updated");
        } else {
            result = await createUser(formData);

            successMessage = t("user.created");
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
                            {t("user.name")}
                        </label>
                        <input
                            type="text"
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={user.name}
                            onChange={(e) => updateField("name", e.target.value)}
                        />
                        {error.name && <small className="text-red-500">{error.name}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("user.username")}
                        </label>
                        <input
                            type="text"
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={user.username}
                            onChange={(e) => updateField("username", e.target.value)}
                        />
                        {error.username && <small className="text-red-500">{error.username}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("user.email")}
                        </label>
                        <input
                            type="email"
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={user.email}
                            onChange={(e) => updateField("email", e.target.value)}
                        />
                        {error.email && <small className="text-red-500">{error.email}</small>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("user.password")}
                        </label>
                        <input
                            type="password"
                            className="text-sm mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={user.password}
                            onChange={(e) => updateField("password", e.target.value)}
                        />
                        {error.password && <small className="text-red-500">{error.password}</small>}
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={user.isDeleted}
                            onChange={(e) => updateField("isDeleted", e.target.checked)}
                        />
                        <label className="text-sm font-medium text-gray-700 cursor-pointer">
                            {t("user.isDeleted")}
                        </label>
                    </div>

                    {error.isDeleted && <small className="text-red-500">{error.isDeleted}</small>}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="border border-gray-600 text-gray-600 font-bold px-4 py-1 rounded hover:bg-gray-600 hover:border-gray-600 hover:text-white transition cursor-pointer"
                        >
                            {data ? t("user.updateUser") : t("user.createUser")}
                        </button>
                    </div>
                </form>
            </div>

            <LoadingOverlay show={loading} />
        </>
    );
};

export default UserForm;