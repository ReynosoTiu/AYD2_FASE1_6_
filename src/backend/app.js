import express from "express";
import cors from "cors";
import morgan from "morgan";

import usersRoutes from "./routes/users.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import generalRoutes from "./routes/general.routes.js";
import asistantRoutes from "./routes/assistant.routes.js"

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
// Routes
app.use("/api", usersRoutes);
app.use("/api", driverRoutes);
app.use("/api", generalRoutes);
app.use("/api", asistantRoutes);


export default app;