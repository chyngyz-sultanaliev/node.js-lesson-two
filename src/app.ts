import "dotenv/config";
import path from "path";
import express from "express";
import globalRoutes from "./routes";

const buildServer = () => {
  const server = express();
  server.use(express.json());

  server.use(express.static(path.join(__dirname, "../public")));

  server.use("/api", globalRoutes);

  server.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  server.use((_req, res) => {
    res.status(404).json({ success: false, message: "Not Found" });
  });

  return server;
};

export default buildServer;
