"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http = __importStar(require("http"));
var socket_io_1 = require("socket.io");
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
var server = http.createServer(app);
var io = new socket_io_1.Server(server);
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("disconnect", function () {
        console.log("User disconnected");
    });
    socket.on("chat message", function (msg, msgType) {
        console.log("message: " + msg);
        console.log("type: " + msgType);
        io.emit("chat message", msg, 'outgoing');
        //@todo do something cool to get the response
        sleep(3000).then(function () {
            io.emit("chat message", 'RESPONSE', 'incoming');
        });
    });
});
app.get("/", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "../public", "index.html"));
});
app.get("/css/:file", function (req, res) {
    var fileName = req.params.file;
    res.sendFile(path_1.default.join(__dirname, "../public", fileName));
});
var PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
