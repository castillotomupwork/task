import { z } from "zod";
import { isUsernameTaken, isEmailTaken } from "../services/user-service";
import { TFunction } from "i18next";

export const storeUserValidator = (t: TFunction) => 
    z.object({
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
            .superRefine(async (val, contx) => {
                const exists = await isUsernameTaken(val);

                if (exists) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["username"],
                        message: t("user.validation.username.duplicate", { value: val }),
                    });
                }
            })
        ,
            
        email: z
            .string({
                required_error: t("user.validation.email.required"),
            })
            .email(t("user.validation.email.invalid"))
            .superRefine(async (val, contx) => {
                const exists = await isEmailTaken(val);

                if (exists) {
                    contx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["email"],
                        message: t("user.validation.email.duplicate", { value: val }),
                    });
                }
            })
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
    });