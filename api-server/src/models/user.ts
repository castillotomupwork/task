import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument } from "../interfaces/user-document";

const UserSchema = new Schema<UserDocument>(
    {
        name: {
            type: String, 
            required: true,
        },
        username: {
            type: String, 
            required: true,
            unique: true,
        },
        email: {
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String, 
            required: true, 
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function (next) {
    const user = this as UserDocument;

    if (!user.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password, salt);

        return next();
    } catch (error) {
        return next(error as Error);
    }
});

UserSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as any;

    if (!update) {
        return next();
    }

    try {
        const password = update.password || update.$set?.password;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            if (update.password) {
                update.password = hashed;
            }

            if (update.$set) {
                update.$set.password = hashed;
            }
        }

        return next();
    } catch (error) {
        return next(error as Error);
    }

    
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<UserDocument>("User", UserSchema);