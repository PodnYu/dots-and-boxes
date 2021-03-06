import { Socket } from "socket.io";
import Lobby from "./Lobby";

enum PlayerColor {
  Red = '#ddsafsd',
}

export default class Player {

  nickname: string;
  lobby: string;
  color: string | null;
  socket: Socket;

  constructor(socket: Socket, nickname: string) {
    this.socket = socket;
    this.nickname = nickname;
    this.lobby = "";
    this.color = null;
  }
 
}