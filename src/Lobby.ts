import Player from "./Player";
import { playerManager } from "./PlayerManager";

export default class Lobby {

  name: string;
  host: Player;
  players: Player[];

  playerCount: number;
  width: number;
  height: number;

  constructor(name: string, host: Player, width: number, height: number, playerCount: number) {
    this.name = name;
    this.host = host;
    this.players = [host];
    this.width = width;
    this.height = height;
    this.playerCount = playerCount;
  }

}