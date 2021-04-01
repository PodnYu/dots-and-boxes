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

	socket.on("createPlayer", ({ nickname }: { nickname: string }, cb: (obj: {ok: boolean}) => void) => {
		const nicknameAvailable = playerManager.isNicknameAvailable(nickname);

		console.log(`is nickname available[${nickname}: ${nicknameAvailable.toString()}].`);
		
		if (nicknameAvailable) {
			console.log(`Player[${nickname}] created`);
			playerManager.addPlayer(socket, nickname);
		}

		cb({ ok: nicknameAvailable });
	});

	socket.on("enterPlayer", () => {
		const player = playerManager.getPlayer(socket.id);
		if (!player) return;

		socketJoin("home");
		console.log("Player entered");

		socket.to("home").emit("playerEntered", { nickname: player.nickname });
	});

	socket.on("getPlayersList", (cb: (obj: unknown) => void) => {
		cb({ playersList: playerManager.getPlayersWithoutLobbies().map(player => player.nickname) });
	});

	socket.on("getLobbiesList", (cb: (obj: unknown) => void) => {
		cb({ lobbiesList: lobbyManager.getLobbiesParameters() });
	});

	socket.on("createLobby", ({ name, width, height, playersCount }: IGameParameters, cb: (obj: { ok: boolean }) => void) => {
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

		socket.to("home").emit("lobbyCreated", { lobby: lobbyManager.getLobbyParameters(name) });
		socket.to("home").emit("playerJoined", { nickname: player.nickname });

		cb({ ok: true });
	});

	socket.on("joinPlayer", ({ name }: { name: string }, cb: (obj: unknown) => void) => {
		const player = playerManager.getPlayer(socket.id);
		if (player) {
			player.lobbyName = name;
			socket.to("home").emit("playerJoined", { nickname: player.nickname }); 
		}

		const lobbyExists = lobbyManager.lobbyExists(name);
		const lobbyAvailable = lobbyManager.lobbyAvailable(name);

		if (lobbyExists && lobbyAvailable) {
			socketLeave("home");
			socketJoin(name);

			cb({
				status: lobbyExists,
				fieldParameters: lobbyManager.getLobbyParameters(name),
				playersParameters: lobbyManager.getPlayersParameters(name),
			});
		} else cb({ status: lobbyExists });
	});

	socket.on("leavePlayer", () => {
		const player = playerManager.getPlayer(socket.id);

		if (player) {
			socketLeave(playerManager.getPlayer(socket.id).lobbyName); 
			player.lobbyName = "";
		}
	});

	socket.on("disconnect", function () {
		console.log(`User[${socket.id}] disconnected`);

		const player = playerManager.getPlayer(socket.id);
		if (!player) return;

		socketLeave(playerManager.getPlayer(socket.id).lobbyName);

		socket.to("home").emit("playerExited", { nickname: player.nickname });
		playerManager.removePlayer(socket.id);
	});

	function socketJoin(lobbyName: string) {
		socket.join(lobbyName);
		playerManager.setLobby(socket.id, lobbyName === "home" ? "" : lobbyName);
	}

	function socketLeave(lobbyName: string) {

		console.log(`socketLeave[${socket.id}] from lobby ${lobbyName}.`);

		if (lobbyName) socket.leave(lobbyName);
		else return;

		if (lobbyName != "home") {
			const lobby = lobbyManager.getLobby(lobbyName);
			if (!lobby) return;

			if (lobby.isPlayerHost(playerManager.getPlayer(socket.id))) {
				socket.to("home").emit("lobbyStopped", { name: lobby.name });

				socket.to(lobby.name).emit("hostLeft");

				lobbyManager.removeLobby(lobby.name);
			} else {
				socket.to(lobby.name).emit("playerLeft");
			}
		}
	}
});

server.listen(PORT, () => {
	console.log(`Listening on 127.0.0.1:${PORT}...`);
});
