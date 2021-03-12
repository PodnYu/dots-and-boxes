import Lobby from "./Lobby";
import Player from "./Player";

interface IGameParameters {
	name: string;
	width: number;
	height: number;
	playersCount: number;
}

export class LobbyManager {
	lobbies: { [key: string]: Lobby } = {};

	// constructor() {}

	addLobby(name: string, player: Player, width: number, height: number, playersCount: number): void {
		this.lobbies[name] = new Lobby(name, player, width, height, playersCount);

		player.lobby = name;
	}

	getLobby(name: string): Lobby {
		return this.lobbies[name];
	}

	getPlayersParameters(name: string): ({ nickname: string; color: string | null } | null)[] {
		const lobby = this.lobbies[name];

		return lobby.players.map((player) => {
			if (player.nickname) return { nickname: player.nickname, color: player.color };
			else return null;
		});
	}

	getLobbyParameters(name: string): { host: string; width: number; height: number } {
		const lobby = this.lobbies[name];

		return { host: lobby.host.nickname, width: lobby.width, height: lobby.height };
	}

	removeLobby(lobbyName: string): void {
		delete this.lobbies[lobbyName];
	}

	getLobbiesList(): IGameParameters[] {
		return Object["values"](this.lobbies).map((item) => {
			return { name: item.name, width: item.width, height: item.height, playersCount: item.playersCount };
		});
	}

	isNameAvailable(name: string): boolean {
		return !Object["values"](this.lobbies)
			.map((item) => item.name)
			.includes(name);
	}

	isLobbyExisted(name: string): boolean {
		return Object["values"](this.lobbies)
			.map((item) => item.name)
			.includes(name);
	}
}

export const lobbyManager = new LobbyManager();
