import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import path from "path";

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        preload: ["en", "fr"],
        backend: {
            loadPath: path.resolve(__dirname, "../src/locales/{{lng}}.json"),
        }
    });

export default i18next;