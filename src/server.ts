import http from "http";
import express from "express";
import { Socket, Server } from "socket.io";

import { playerManager } from "./PlayerManager";
import { lobbyManager } from "./LobbyManager";

interface IGameParameters {
	name: string;
	width: number;
	height: number;
	playersCount: number;
}

const PORT = 5005;

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket: Socket) => {
	console.log(`Player[${socket.id}] connected`);

	socket.on("createPlayer", ({ nickname }: { nickname: string }, cb) => {
		const nicknameAvailable = playerManager.isNicknameAvailable(nickname);

		console.log(`is nickname available[${nickname}: ${nicknameAvailable}].`);
		cb({ ok: nicknameAvailable });

		if (nicknameAvailable) {
			console.log(`Player[${nickname}] created`);

			playerManager.addPlayer(socket, nickname);
		}
	});

	socket.on("enterPlayer", () => {
		const player = playerManager.getPlayer(socket.id);
		if (!player) return;

		socketJoin("home");
		console.log("Player entered");

		socket.to("home").emit("playerEntered", { nickname: player.nickname });
	});

	socket.on("getPlayersList", (cb) => {
		cb({ playersList: playerManager.getNames() });
	});

	socket.on("getLobbiesList", (cb) => {
		cb({ lobbiesList: lobbyManager.getLobbiesList() });
	});

	socket.on("createLobby", ({ name, width, height, playersCount }: IGameParameters, cb) => {
		if (!lobbyManager.isNameAvailable(name)) {
			cb({ ok: false });

			return;
		}

		console.log("Lobby created:");
		console.log(`\tname: ${name}`);
		console.log(`\twidth: ${width}`);
		console.log(`\theight: ${height}`);
		console.log(`\tplayerCount: ${playersCount}`);

		const player = playerManager.getPlayer(socket.id);
		if (player) lobbyManager.addLobby(name, player, width, height, playersCount);

		socket.to("home").emit("lobbyCreated", { name, width, height, playersCount });

		cb({ ok: true });
	});

	socket.on("joinPlayer", ({ name }: { name: string }, cb) => {
		const player = playerManager.getPlayer(socket.id);
		if (player) socket.to("home").emit("playerJoined", { nickname: player.nickname });

		const isLobbyExisted = lobbyManager.isLobbyExisted(name);

		if (isLobbyExisted) {
			socketLeave("home");
			socketJoin(name);

			cb({
				status: isLobbyExisted,
				fieldParameters: lobbyManager.getLobbyParameters(name),
				playersParameters: lobbyManager.getPlayersParameters(name),
			});
		} else cb({ status: isLobbyExisted });
	});

	socket.on("leavePlayer", () => {
		const player = playerManager.getPlayer(socket.id);

		if (player) socketLeave(playerManager.getPlayer(socket.id).lobby);
	});

	socket.on("disconnect", function () {
		console.log(`User[${socket.id}] disconnected`);

		const player = playerManager.getPlayer(socket.id);
		if (!player) return;

		socketLeave(playerManager.getPlayer(socket.id).lobby);

		socket.to("home").emit("playerExited", { nickname: player.nickname });
		playerManager.removePlayer(socket.id);
	});

	function socketJoin(lobbyName: string) {
		socket.join(lobbyName);
		playerManager.setLobby(socket.id, lobbyName);
	}

	function socketLeave(lobbyName: string) {
		if (lobbyName) socket.leave(lobbyName);
		else return;

		if (lobbyName != "home") {
			const lobby = lobbyManager.getLobby(lobbyName);

			if (lobby.host == playerManager.getPlayer(socket.id)) {
				socket.to("home").emit("lobbyStopped", { name: lobby.name });

				socket.to(lobby.name).emit("hostLeaved");

				lobbyManager.removeLobby(lobby.name);
			} else {
				socket.to(lobby.name).emit("playerLeaved");
			}
		}
	}
});

console.log("");

server.listen(PORT, () => {
	console.log(`Listening on 127.0.0.1:${PORT}...`);
});
