/* eslint-disable @typescript-eslint/no-unsafe-call */
import http from "http";
import express from "express";
import * as sockets from "socket.io";

const PORT = 8000;

const app: express.Application = express();
const server: http.Server = http.createServer(app);

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const io: sockets.Server = new sockets.Server(server, { cors: { origin: "*" } });

const homeRoom: { [key: string]: string } = {};
const lobbies: { [key: string]: string } = {};

io.on("connection", (socket: sockets.Socket) => {
	console.log("user connected");

	socket.join("home");
	homeRoom[socket.id] = "";

	io.sockets.emit("playersList", homeRoom);

	socket.on("createLobby", (gameParameters: any) => {
		socket.leave("home");
		delete homeRoom[socket.id];

		console.log("");

		lobbies[gameParameters.name] = { ...gameParameters, host: socket.id };

		socket.join(gameParameters.name);

		io.sockets.emit("lobbiesList", lobbies);
	});

	socket.on("disconnect", function () {
		console.log("A user disconnected");

		socket.leave("home");
		delete homeRoom[socket.id];

		for (const lobby in lobbies) {
			if (lobby.host == socket.id) delete lobbies.lobby;
		}

		io.sockets.emit("playersList", homeRoom);
	});
});

server.listen(PORT, () => {
	console.log("Listening...");
});

// const io = require("socket.io")();
// let freePlayers = [];

// io.on("connection", (client: any) => {
// 	freePlayers.push(client);
// 	console.log(client);
// });

// const port = 3000;
// io.listen(port);

// const PORT = 5000;

// const server = require("http").createServer(app);

// let io = require("socket.io")(server);

// io.on("connection", (socket: socketio.Socket) => {
// 	console.log("a user connected");

// 	socket.emit("message", "It's working");

// 	socket.on("message", (message: any) => {
// 		console.log(`message: ${message}`);
// 	});
// });

// server.listen(PORT, function() {
// 	console.log(`listening on 127.0.0.1:${PORT}`);
// });
