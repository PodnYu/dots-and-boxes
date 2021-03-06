import { Socket } from "socket.io";
import Player from "./Player";

export class PlayerManager {

  players: Player[] = [];

  constructor() {

  }

  addPlayer(socket: Socket, nickname: string) {
    this.players.push(new Player(socket, nickname));
  }

  // addPlayer(player: Player) {
  //   this.players.push(player);
  // }

  removePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
  }

  removePlayerBySocketId(socketId: string) {
    // this.players.splice(this.players.indexOf(this.getPlayerBySocketId(socketId)), 1);
    this.players = this.players.filter(player => player.socket.id != socketId);
  }

  getPlayerBySocketId(socketId: string): Player {
    let player = this.players.find(player => player.socket.id == socketId);
    if (!player) {
      throw new Error(`Player with socketid[${socketId}] not found!`);
    }

    return player;
  }

  getNames() {
    return this.players.map(player => player.nickname);
  }

  isNicknameAvailable(nickname: string) {
    return !this.getNames().includes(nickname);
  }

}

export const playerManager = new PlayerManager();