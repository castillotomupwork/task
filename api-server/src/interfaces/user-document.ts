import mongoose, { Document } from "mongoose";
import { UserInput } from "./user-input";

export interface UserDocument extends UserInput, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
};
