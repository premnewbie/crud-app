import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import clientRoutes from "./routes/client.routes.js";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.use("/api", clientRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log("Server started on:", port);
});