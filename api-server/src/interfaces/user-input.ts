export interface UserInput {
  name: string,
  username: string;
  email: string;
  password: string;
  isDeleted?: boolean | undefined;
}