import Player from "./Player";

const emptyPlayer = new Player(null, "");

export default class Lobby {
	name: string;

	host: Player;
	players: (Player | null)[] = [];

	width: number;
	height: number;

	freePlacesCount: number;
	playersCount: number;

	isStarted: boolean;

	constructor(name: string, host: Player, width: number, height: number, playersCount: number) {
		this.name = name;
		this.host = host;

		this.players.push(host);
		for (let i = 1; i < 4; i++) {
			this.players.push(emptyPlayer);
		}

		this.width = width;
		this.height = height;
		this.freePlacesCount = playersCount - 1;
		this.playersCount = playersCount;
		this.isStarted = false;
	}
}
