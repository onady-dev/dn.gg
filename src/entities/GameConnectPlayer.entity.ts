import { Column, Entity, ManyToOne } from "typeorm";
import { Game } from "./Game.entity";
import { Player } from "./Player.entity";
@Entity()
export class GameConnectPlayer {
  @Column('int', {
    primary: true,
  })
  groupId: number;
  @Column('int', {
    primary: true,
  })
  gameId: number;
  @Column('int', {
    primary: true,
  })
  playerId: number;
  @Column('varchar', { length: 10 })
  team: string;
  
  @ManyToOne(() => Game, (game) => game.gameConnectPlayers)
  game: Game;
  @ManyToOne(() => Player, (player) => player.gameConnectPlayers)
  player: Player;
}

