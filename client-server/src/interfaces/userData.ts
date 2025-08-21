export interface UserData {
    _id: string;
    name: string,
    username: string;
    email: string;
    password: string;
    isDeleted?: boolean | undefined;
}