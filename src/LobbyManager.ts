import Lobby from "./Lobby";
import Player from "./Player";

interface ILobbyParameters {
	hostNickname: string;
	name: string;
	width: number;
	height: number;
	playersCount: number;
	availablePlacesCount: number;
}

export class LobbyManager {
	lobbies: { [key: string]: Lobby } = {};

	// constructor() {}

	addLobby(name: string, player: Player, width: number, height: number, playersCount: number): void {
		this.lobbies[name] = new Lobby(name, player, width, height, playersCount);

		player.lobbyName = name;
	}

	getLobby(name: string): Lobby {
		return this.lobbies[name];
	}

	getPlayersParameters(name: string): { opened: boolean, playerNickname: string | null; color: string | null }[] {
		const lobby = this.lobbies[name];

		// return lobby.getPlayers().map(player => {
		// 	return { 
		// 		nickname: player.nickname, 
		// 		color: player.color 
		// 	};
		// });

		return lobby.getPlaces().map(place => {
			return {
				opened: place.opened,
				playerNickname: place.player?.nickname || null,
				color: place.player?.color || null
			};
		});

		// return lobby.players.map((player) => {
		// 	if (player.nickname) return { nickname: player.nickname, color: player.color };
		// 	else return null;
		// });
	}

	removeLobby(lobbyName: string): void {
		delete this.lobbies[lobbyName];
	}

	// getLobbyParameters(name: string): { host: string; width: number; height: number } {
	// 	const lobby = this.lobbies[name];

	// 	return { host: lobby.host.nickname, width: lobby.width, height: lobby.height };
	// }

	getLobbiesParameters(): ILobbyParameters[] {
		return Object["values"](this.lobbies).map((item) => this.getLobbyParameters(item.name));
	}

	getLobbyParameters(lobbyName: string): ILobbyParameters {
		const lobby = this.getLobby(lobbyName);

		return { 
			name: lobby.name, 
			width: lobby.width, 
			height: lobby.height,
			hostNickname: lobby.host.nickname,
			playersCount: lobby.getPlayersCount(),
			availablePlacesCount: lobby.getAvailablePlacesCount()
		};
	}

	// isNameAvailable(name: string): boolean {
	// 	return !Object["values"](this.lobbies)
	// 		.map((item) => item.name)
	// 		.includes(name);
	// }

	isNameAvailable(name: string): boolean {
		return !this.lobbyExists(name);
	}

	// lobbyExists(name: string): boolean {
	// 	return Object["values"](this.lobbies)
	// 		.map((item) => item.name)
	// 		.includes(name);
	// }

	lobbyExists(name: string): boolean {
		return this.lobbies[name] !== undefined;
	}

	lobbyAvailable(name: string): boolean {
		return this.lobbies[name].isAvailable();
	}

	getLobbyPlayers(name: string): Player[] {
		return this.lobbies[name].getPlayers();
	}

	getLobbyNicknames(name: string): string[] {
		return this.getLobbyPlayers(name).map(player => player.nickname);
	}
}

export const lobbyManager = new LobbyManager();
