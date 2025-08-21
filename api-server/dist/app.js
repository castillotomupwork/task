"use strict";
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.use(cors());
// app.use(express.json());
// mongoose
//   .connect(process.env.MONGO_URL || "mongodb://localhost:27017/mydb", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));
// app.get("/", (req, res) => {
//   res.send("Hello from Backend!");
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
/* when init failed
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (res: { send: (arg0: string) => void; }) => {
  res.send("Hello World!");
});
const port = 500;
app.listen(port, () => console.log(`Server started successfully on port: ${port}`));
*/
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello World again!");
});
app.listen(port, () => console.log(`Server started successfully on port: ${port}`));
