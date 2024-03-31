"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const config_1 = require("./config");
app.get("/", (req, res) => {
    return res.json("Socket server is active 😀😍🥰");
});
httpServer.listen(config_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Backend runnig on port ${config_1.PORT}`);
}));
//Socket //
const io = new socket_io_1.Server(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        console.log(`user with ${userData === null || userData === void 0 ? void 0 : userData.id} connected`);
        socket.join(userData === null || userData === void 0 ? void 0 : userData.id);
        socket.emit("connected", userData === null || userData === void 0 ? void 0 : userData.name);
    });
    socket.on("join room", (room) => {
        console.log("user joined room", room);
        socket.join(room);
    });
    socket.on("send_message", ({ messageRecieved, room }) => {
        var chat = messageRecieved;
        chat.conversation.users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.userId == messageRecieved.sender.id)
                return;
            socket.to(room).emit("get_Message", messageRecieved);
        }));
    });
});
