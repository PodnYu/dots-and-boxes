import http from "http";
import express from "express";
import { Socket, Server } from "socket.io";

import { playerManager } from "./PlayerManager";
import { lobbyManager } from "./LobbyManager";
import Lobby from "./Lobby";

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
		socket.leave("home");
		socket.join(name);

		cb({ ok: true });
	});

	socket.on("home/isLobbyAvailable", ({ lobbyName }: { lobbyName: string }, cb: (obj: { ok: boolean }) => void) => {
		console.log(`home/isLobbyAvailable[${lobbyName}]: ${lobbyManager.isLobbyAvailable(lobbyName).toString()}`);
		cb({ ok: lobbyManager.isLobbyAvailable(lobbyName) });
	});

	socket.on("joinPlayer", ({ name }: { name: string }, cb: (obj: unknown) => void) => {
		const player = playerManager.getPlayer(socket.id);

		const lobbyExists = lobbyManager.lobbyExists(name);
		const isLobbyAvailable = lobbyManager.isLobbyAvailable(name);
		const canJoin = lobbyExists && isLobbyAvailable;

		if (canJoin) {
			const lobby = lobbyManager.getLobby(name);
			const placeIndex = lobby.addPlayer(player);
			
			if (placeIndex === -1) {
				cb({ ok: false });
				return;
			}
			
			player.setLobbyName(name);
			socket.leave("home");
			socketJoin(name);

			socket.to("home").emit("playerJoined", { nickname: player.nickname }); 
			socket.to("home").emit("placeChanged", { 
				lobbyName: name,
				playersCount: lobby.getPlayersCount(),
				placesCount: lobby.getPlacesCount()
			});

			console.log(`player[${player.nickname}] joined lobby[${name}]`);
			socket.to(name).emit("lobby/playerJoined", { playerNickname: player.nickname, placeIndex, color: null });
			socket.leave("home");

			cb({
				ok: canJoin,
				fieldParameters: lobbyManager.getLobbyParameters(name),
				playersParameters: lobbyManager.getPlayersParameters(name)
			});
		} else cb({ ok: canJoin });
	});

	socket.on("leavePlayer", () => {
		const player = playerManager.getPlayer(socket.id);

		if (player) {
			socketLeave(player.lobbyName); 
			player.setLobbyName("");
		}
	});

	socket.on("lobby/placeChanged", ({ lobbyName, placeIndex, opened }: { lobbyName: string, placeIndex: number, opened: boolean }, cb: (status: { ok: boolean }) => void) => {

		console.log("lobby/placeChanged:");
		console.log(`\tlobbyName: ${lobbyName}`);
		console.log(`\tplaceIndex: ${placeIndex}`);
		console.log(`\topened: ${opened.toString()}`);

		if (isNaN(placeIndex) || placeIndex < 1 || placeIndex >= Lobby.maxPlayersCount) {
			cb({ ok: false });
			return;
		}

		const lobby = lobbyManager.getLobby(lobbyName);
		if (!lobby) {
			cb({ ok: false });
			return;
		}

		const place = lobby.getPlace(placeIndex);
		place.opened = opened;
		const removedPlayer = place.player;

		socket.to("home").emit("placeChanged", { 
			lobbyName, 
			playersCount: lobby.getPlayersCount(), 
			placesCount: lobby.getPlacesCount() 
		});

		if (removedPlayer) {
			place.player = null;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			removedPlayer.socket!.emit("lobby/removedByHost");
		}

		cb({ ok: true });
	});

	socket.on("lobby/fieldParametersChanged", ({ lobbyName, width, height }: { lobbyName: string, width: number, height: number }) => {
		console.log("lobby/fieldParametersChanged: ", lobbyName, width, height);
		const lobby = lobbyManager.getLobby(lobbyName);

		if (!lobby)
			return;

		lobby.setSize(width, height);
		socket.to(lobby.name).emit("lobby/fieldParametersChanged", {
			width,
			height
		});
		socket.to("home").emit("fieldParametersChanged", {
			lobbyName,
			width,
			height
		});
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

		if (lobbyName != "") {
			const lobby = lobbyManager.getLobby(lobbyName);
			if (!lobby) return;

			if (lobby.isPlayerHost(playerManager.getPlayer(socket.id))) {
				socket.to("home").emit("lobbyStopped", { name: lobby.name });

				socket.to(lobby.name).emit("lobby/hostLeft");

				lobbyManager.removeLobby(lobby.name);
			} else {

				const leftPlayer = playerManager.getPlayer(socket.id);

				lobby.removePlayer(leftPlayer);

				socket.to(lobby.name).emit("lobby/playerLeft", { playerNickname: leftPlayer.nickname});
				socket.to("home").emit("placeChanged", {
					lobbyName: lobby.name,
					playersCount: lobby.getPlayersCount(),
					placesCount: lobby.getPlacesCount()
				});
			}
		}
	}
});

server.listen(PORT, () => {
	console.log(`Listening on 127.0.0.1:${PORT}...`);
});
