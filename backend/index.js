import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import clientRoutes from "./routes/client.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.use("/api",clientRoutes);

app.listen(port,() => {
    console.log("Server started on:",port);
})