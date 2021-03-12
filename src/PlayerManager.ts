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

	setLobby(socketId: string, lobby: string): void {
		this.players[socketId].lobby = lobby;
	}

	getNames(): string[] {
		return Object["values"](this.players).map((player) => player.nickname);
	}

	isNicknameAvailable(nickname: string): boolean {
		return !this.getNames().includes(nickname);
	}
}

export const playerManager = new PlayerManager();
