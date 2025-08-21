import i18n from "../i18n";
import axios from "axios";
import { serverUrl } from "../helpers/Constants";
import type { UserData } from "../interfaces/userData";

const emptyUserData: UserData = {
    _id: "",
    name: "",
    username: "",
    email: "",
    password: "",
};

export const getUsersOptions = async(    
): Promise<{
    data: UserData[];
    error: string;
}> => {
    try {
        const response = await axios.get(`${serverUrl}/users`);

        if (response.data.success === true) {
            return {
                data: response.data.data,
                error: "",
            };
        }

        return {
            data: [],
            error: response.data.message,
        };
    } catch (error: any) {
        return {
            data: [],
            error: i18n.t("systemError"),
        };
    }
};

export const getUsers = async(
    field: string = "",
    order: "asc" | "desc" = "asc",
    page: number = 1,
    limit: number = 10
): Promise<{
    data: UserData[];
    total: number;
    error: string;
}> => {
    try {
        const response = await axios.get(`${serverUrl}/users`, {
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

export const createUser = async(user: UserData): Promise<{
    data: UserData;
    error: string;
}> => {
    try {
        const response = await axios.post(`${serverUrl}/users`, user,
            {
                headers: {
                    "Accept-Language": i18n.language
                }
            }
        )

        if (response.data.success === true) {
            return {
                data: response.data.data,
                error: "",
            };
        }

        return {
            data: emptyUserData,
            error: response.data.message || i18n.t("user.failedCreate"),
        };
    } catch (error: any) {
        const statusCode = error.response?.status;

        if (statusCode === 400) {
            return {
                data: emptyUserData,
                error: error?.response?.data?.message,
            };
        }

        return {
            data: emptyUserData,
            error: i18n.t("systemError"),
        };
    }
};

export const updateUser = async(user: UserData): Promise<{
    data: UserData;
    error: string;
}> => {
    try {
        const response = await axios.put(`${serverUrl}/users/${user._id}`, user,
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
            data: emptyUserData,
            error: response.data.message || i18n.t("user.failedUpdate"),
        };
    } catch (error: any) {
        const statusCode = error.response?.status;

        if (statusCode === 400) {
            return {
                data: emptyUserData,
                error: error?.response?.data?.message,
            };
        }

        return {
            data: emptyUserData,
            error: i18n.t("systemError"),
        };
    }
};

export const deleteUser = async(user: UserData): Promise<{
    success: boolean;
    error: string;
}> => {
    try {
        const response = await axios.delete(`${serverUrl}/users/${user._id}`,
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
            error: response.data.message || i18n.t("user.failedDelete"),
        };
    } catch (error: any) {
        return {
            success: false,
            error: i18n.t("systemError"),
        };
    }
};