import * as React from "react";
import Header from "./components/Headers/Header";
import Footer from "./components/Footers/Footer";
import TaskView from "./components/Task/TaskView";
import TaskForm from "./components/Task/TaskForm";
import UserView from "./components/User/UserView";
import UserForm from "./components/User/UserForm";
import type { TaskData } from "./interfaces/taskData";
import type { UserData } from "./interfaces/userData";
import { useTranslation } from "react-i18next";

type ModuleType = "users" | "tasks";
type ContainerType = "view" | "form";

interface IAppProps {
}

const App: React.FunctionComponent<IAppProps> = () => {
    const { i18n } = useTranslation();

    const [activeModule, setActiveModule] = React.useState<ModuleType>("tasks");
    const [activeContainer, setActiveContainer] = React.useState<ContainerType>("view");
    const [formData, setFormData] = React.useState<TaskData | UserData | null>(null);
    const viewRef = React.useRef<{ refresh: () => void }>(null);
    
    const handleLanguageChange = async (lang: string) => {
        if (i18n.language !== lang) {
            await i18n.changeLanguage(lang);

            viewRef.current?.refresh();
        }
    };

    const renderModule = () => {
        switch (activeModule) {
            case "users":
                switch (activeContainer) {
                    case "form":
                        return <UserForm
                            data={formData as UserData | null}
                        />;
                    case "view":
                    default:
                        return <UserView
                            ref={viewRef}
                            sendChangeContent={processChangeContent}
                        />;
                }

            case "tasks":
            default:
                switch (activeContainer) {
                    case "form":
                        return <TaskForm
                            data={formData as TaskData | null}
                        />;
                    case "view":
                    default:
                        return <TaskView
                            ref={viewRef}
                            sendChangeContent={processChangeContent}
                        />;
                }
        }
    };

    const processChangeContent = (module: ModuleType, container: ContainerType, data: TaskData | UserData | null = null) => {
        setActiveModule(module);
        setActiveContainer(container);

        if (container === "form") {
            setFormData(data);
        }
    };

    return (
        <React.StrictMode>
            <Header
                triggerMenu={processChangeContent}
                activeModule={activeModule}
                activeContainer={activeContainer}
                onLanguageChange={handleLanguageChange}
            />
            {renderModule()}
            <Footer/>
        </React.StrictMode>
    );
};

export default App;
