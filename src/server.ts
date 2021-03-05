import http from "http";
import express from "express";
import { Socket } from "socket.io";

const PORT = 5005;

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*" } });

// const homeRoom: { [key: string]: any } = {};
const homeRoom: string[] = [];
const lobbies: { [key: string]: any } = {};

io.on("connection", (socket: Socket) => {
	console.log("user connected");

	socket.join("home");
	homeRoom.push(socket.id);

	io.to("home").emit("playersList", homeRoom);

	socket.on("createLobby", (gameParameters: any) => {
		socket.leave("home");
		// delete homeRoom[socket.id];
		homeRoom.splice(homeRoom.indexOf(socket.id), 1);

		lobbies[gameParameters.name] = { ...gameParameters, host: socket.id };

		socket.join(gameParameters.name);

		io.sockets.emit("lobbiesList", lobbies);
	});

	socket.on("disconnect", function () {
		console.log("A user disconnected");

		socket.leave("home");

		homeRoom.splice(homeRoom.indexOf(socket.id), 1);

		for (const lobby in lobbies) {
			if (lobbies[lobby].host == socket.id) delete lobbies.lobby;
		}

		io.sockets.emit("playersList", homeRoom);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on 127.0.0.1:${PORT}...`);
});
