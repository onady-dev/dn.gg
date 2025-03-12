import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game.entity";
import { Logitem } from "./Logitem.entity";
import { Player } from "./Player.entity";
@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  groupId: number;
  @Column('int')
  gameId: number;
  @Column('int')
  playerId: number;
  @Column('int')
  logitemId: number;
  
  @ManyToOne(() => Game, (game) => game.logs)
  game: Game;
  @ManyToOne(() => Logitem, (logitem) => logitem.logs)
  logitem: Logitem;
  @ManyToOne(() => Player, (player) => player.logs)
  player: Player;
}
