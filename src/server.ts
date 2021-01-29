import express from "express";
import socketio from "socket.io";
import sampleModule = require("http");
// const socketio = require("socket.io");
import http from "http";

const app = express();

const PORT = 5000;

const server = require("http").createServer(app);

let io = require("socket.io")(server);

io.on("connection", (socket: socketio.Socket) => {
	console.log("a user connected");

	socket.emit("message", "It's working");

	socket.on("message", (message: any) => {
		console.log(`message: ${message}`);
	});
});

server.listen(PORT, function() {
	console.log(`listening on 127.0.0.1:${PORT}`);
});