import { z } from "zod";
import { isUsernameTaken, isEmailTaken } from "../services/user-service";
import { TFunction } from "i18next";

export const updateUserValidator = (t: TFunction) => 
    z.object({
        id: z
            .string({
                required_error: t("user.validation.id.required"),
            })
            .trim()
            .min(1, t("user.validation.id.required"))
        ,

        name: z
            .string({
                required_error: t("user.validation.name.required"),
            })
            .trim()
            .min(1, t("user.validation.name.required"))
        ,
        
        username: z
            .string({
                required_error: t("user.validation.username.required"),
            })
            .trim()
            .min(1, t("user.validation.username.required"))
        ,
            
        email: z
            .string({
                required_error: t("user.validation.email.required"),
            })
            .email(t("user.validation.email.invalid"))
        ,

        password: z
            .string({
                required_error: t("user.validation.password.required")
            })
            .min(6, t("user.validation.password.minLength"))
            .refine(
                (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(val),
                {
                    message: t("user.validation.password.strength"),
                }
            )
        ,

        isDeleted: z
            .boolean()
            .default(false)
            .optional()
        ,
    })
    .superRefine(async (data, contx) => {
        const usernameExists = await isUsernameTaken(data.username, data.id);

        if (usernameExists) {
            contx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["username"],
                message: t("user.validation.username.duplicate", { value: data.username }),
            });
        }

        const emailExists = await isEmailTaken(data.email, data.id);

        if (emailExists) {
            contx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["email"],
                message: t("user.validation.email.duplicate", { value: data.email }),
            });
        }
    });