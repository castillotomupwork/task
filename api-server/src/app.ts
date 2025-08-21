import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import i18next from "./i18n";
import i18nextMiddleware from "i18next-http-middleware";
import connectDb from "./configs/db-config";
import usersRoutes from "./routes/user-route";
import taskRoutes from "./routes/task-route";

dotenv.config();
connectDb();

const port = process.env.PORT || 5000;

const app = express();

app.use(i18nextMiddleware.handle(i18next));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://demo.local",
    credentials: true,
  })
);

app.use("/api/", usersRoutes);
app.use("/api/", taskRoutes);

app.listen(port, () => console.log(`Server started successfully on port: ${port}`));

export default app;