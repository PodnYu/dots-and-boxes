import { Socket } from "socket.io";
import Player from "./Player";

export class PlayerManager {
	players: { [key: string]: Player } = {};

	// constructor() {}

	addPlayer(socket: Socket, nickname: string): void {
		this.players[socket.id] = new Player(socket, nickname);
	}

	removePlayer(socketId: string): void {
		delete this.players[socketId];
	}

	getPlayer(socketId: string): Player {
		return this.players[socketId];
	}

	setLobby(socketId: string, lobbyName: string): void {
		this.players[socketId].setLobbyName(lobbyName);
	}

	getPlayers(): Player[] {
		return Object["values"](this.players);
	}

	getNames(): string[] {
		return this.getPlayers().map(player => player.nickname);
	}

	isNicknameAvailable(nickname: string): boolean {
		return !this.getNames().includes(nickname);
	}

	getPlayersWithoutLobbies(): Player[] {
		return this.getPlayers().filter(player => player.lobbyName === "");
	}
}

export const playerManager = new PlayerManager();
