import * as React from "react";
import { useTranslation } from "react-i18next";

interface IHeaderProps {
    triggerMenu: (module: "users" | "tasks", container: "view" | "form", data?: null) => void;
    activeModule: "users" | "tasks";
    activeContainer: "view" | "form";
    onLanguageChange: (lang: string) => void;
}

const Header: React.FunctionComponent<IHeaderProps> = ({ triggerMenu, activeModule, activeContainer, onLanguageChange }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="container p-2 mx-auto">
            <header className="pt-4 flex flex-col w-full">
                <div className="border-b border-solid border-gray-300 grid grid-cols-2 items-center">
                    <div className="flex justify-start items-center">
                        <h1 className="text-xl font-bold">Demo</h1>
                    </div>
                    
                    <div className="flex justify-end items-center">
                        <button 
                            className={`px-1 cursor-pointer transition-opacity duration-300 ${i18n.language !== "en" ? "opacity-30 hover:opacity-100" : "opacity-100"}`}
                            onClick={() => onLanguageChange("en")}>
                            <span className="fi fi-us"></span>
                        </button>

                        <button 
                            className={`px-1 cursor-pointer transition-opacity duration-300 ${i18n.language !== "fr" ? "opacity-30 hover:opacity-100" : "opacity-100"}`}
                            onClick={() => onLanguageChange("fr")}>
                            <span className="fi fi-fr"></span>
                        </button>
                    </div>
                </div>
                <div className="py-2 grid grid-cols-2 items-center border-b border-solid border-gray-300">
                    <div className="flex justify-start items-center">
                        <button 
                            className="mr-2 border border-gray-600 text-gray-600 font-bold px-4 py-1 rounded hover:bg-gray-600 hover:border-gray-600 hover:text-white transition cursor-pointer"
                            onClick={() => triggerMenu("tasks", "view")}
                        >
                            {t("task.task")}
                        </button>

                        <button 
                            className="border border-gray-600 text-gray-600 font-bold px-4 py-1 rounded hover:bg-gray-600 hover:border-gray-600 hover:text-white transition cursor-pointer"
                            onClick={() => triggerMenu("users", "view")}
                        >
                            {t("user.user")}
                        </button>
                    </div>

                    <div className="flex justify-end items-center">
                        {activeModule === "tasks" && activeContainer == "view" && (
                            <button 
                                className="border border-gray-600 text-gray-600 font-bold px-4 py-1 rounded hover:bg-gray-600 hover:border-gray-600 hover:text-white transition cursor-pointer"
                                onClick={() => triggerMenu("tasks", "form")}
                            >
                                {t("task.newTask")}
                            </button>
                        )}
                        
                        {activeModule === "users" && activeContainer == "view" && (
                            <button 
                                className="border border-gray-600 text-gray-600 font-bold px-4 py-1 rounded hover:bg-gray-600 hover:border-gray-600 hover:text-white transition cursor-pointer"
                                onClick={() => triggerMenu("users", "form")}
                            >
                                {t("user.newUser")}
                            </button>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
