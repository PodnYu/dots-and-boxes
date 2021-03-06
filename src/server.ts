import http from "http";
import express from "express";
import { Socket } from "socket.io";
import Lobby from "./Lobby";
import Player from "./Player";
import { playerManager } from "./PlayerManager";

const PORT = 5005;

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*" } });

const homeRoom: string[] = [];
const lobbies: { [key: string]: any } = {};

io.on("connection", (socket: Socket) => {
	console.log(`User[${socket.id}] connected`);

	socket.on("nicknameAvailable", ({ nickname }, cb) => {
		let nicknameAvailable = playerManager.isNicknameAvailable(nickname);
		console.log(`is nickname available[${nickname}: ${nicknameAvailable}].`);
		cb({ ok:  nicknameAvailable });
	});

	socket.on("createPlayer", ({ nickname }, cb) => {
		console.log(`User[${nickname}] created`);
		playerManager.addPlayer(socket, nickname);
		socket.to("home").emit("playerJoin", { nickname });
		socket.join("home");
		cb({ playersList: playerManager.getNames() });
	});

	socket.on("createLobby", ({ name, width, height, playersCount }) => {
		console.log("Lobby created:");
		console.log(`\tname: ${name}`);
		console.log(`\twidth: ${width}`);
		console.log(`\theight: ${height}`);
		console.log(`\tplayerCount: ${playersCount}`);
		lobbies[name] = new Lobby(name, playerManager.getPlayerBySocketId(socket.id), width, height, playersCount);
	});




	socket.on("disconnect", function () {
		console.log(`User[${socket.id}] disconnected`);
		let playerNickname = playerManager.getPlayerBySocketId(socket.id).nickname;
		playerManager.removePlayerBySocketId(socket.id);
		io.to("home").emit("playerLeave", { nickname: playerNickname });
	});

});

// require('./socketsConfig')(io);

server.listen(PORT, () => {
	console.log(`Listening on 127.0.0.1:${PORT}...`);
});


