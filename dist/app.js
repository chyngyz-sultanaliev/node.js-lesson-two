"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const buildServer = () => {
    const server = (0, express_1.default)();
    server.use(express_1.default.json());
    server.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
    server.use("/api", routes_1.default);
    server.get("/", (_req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
    });
    server.use((_req, res) => {
        res.status(404).json({ success: false, message: "Not Found" });
    });
    return server;
};
exports.default = buildServer;
//# sourceMappingURL=app.js.map