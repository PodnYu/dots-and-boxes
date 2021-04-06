import Player from "./Player";

// const emptyPlayer = new Player(null, "");

export default class Lobby {
	name: string;

	host: Player;
	// players: (Player | null)[] = [];

	width: number;
	height: number;

	freePlacesCount: number;
	playersCount: number;
	static maxPlayersCount = 4;

	places: {
		opened: boolean,
		player: Player | null
	}[] = [];

	isStarted: boolean;

	constructor(name: string, host: Player, width: number, height: number, playersCount: number) {
		this.name = name;
		this.host = host;

		// this.players.push(host);
		// for (let i = 1; i < 4; i++) {
		// 	this.players.push(emptyPlayer);
		// }

		this.width = width;
		this.height = height;
		this.freePlacesCount = playersCount - 1;
		this.playersCount = playersCount;
		this.isStarted = false;

		this.places.push({ opened: true, player: host });
		for (let i = 1; i < Lobby.maxPlayersCount; ++i) {
			let opened = true;
			if (i >= playersCount)
				opened = false;

			this.places.push({ opened, player: null });
		}
	}

	getAvailablePlacesCount(): number {
		return this.places.reduce((acc, el) => (el.opened && el.player == null) ? acc + 1 : acc, 0);
	}

	getPlayersCount(): number {
		return this.places.reduce((acc, el) => (el.player != null) ? acc + 1 : acc, 0);
	}

	isAvailable(): boolean {
		return this.getAvailablePlacesCount() !== 0;
	}

	getPlaces(): {
		opened: boolean,
		player: Player | null
	}[] {
		return this.places;
	}

	getPlace(index: number): {
		opened: boolean,
		player: Player | null
	} {
		return this.places[index];
	}

	addPlayer(player: Player): number {
		let placeIndex = -1;
		for (let i = 0; i < this.places.length; ++i) {
			if (this.places[i].opened && this.places[i].player === null) {
				this.places[i].player = player;
				placeIndex = i;
				break;
			}
		}

		return placeIndex;
	}

	removePlayer(player: Player): void {
		const place = this.places.find(place => place.player?.nickname === player.nickname);
		if (!place)
			return;

		place.opened = true;
		place.player = null;
	}

	/*
		this way or having separate this.players: Player[] array.
	*/
	getPlayers(): Player[] {
		return this.places
			.map(place => place.player)
			.filter((player): player is Player => player != null);
	}

	isPlayerHost(player: Player): boolean {
		return this.host.nickname === player.nickname;
	}

	getPlacesCount(): number {
		return this.places.reduce((acc, el) => el.opened ? acc + 1 : acc, 0);
	}
}
