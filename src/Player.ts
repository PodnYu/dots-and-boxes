import { Socket } from "socket.io";

enum PlayerColor {
	Red = "#ddsafsd",
}

export default class Player {
	nickname: string;
	lobbyName: string;
	color: string | null;
	socket: Socket | null;

	constructor(socket: Socket | null, nickname: string) {
		this.socket = socket;
		this.nickname = nickname;
		this.lobbyName = "";
		this.color = null;
	}
}
