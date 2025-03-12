import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameConnectPlayer } from "./GameConnectPlayer.entity";
import { Log } from "./Log.entity";
@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  groupId: number;
  @Column('date')
  date: Date;
  
  @OneToMany(() => GameConnectPlayer, (gameConnectPlayer) => gameConnectPlayer.game)
  gameConnectPlayers: GameConnectPlayer[];
  @OneToMany(() => Log, (log) => log.game)
  logs: Log[];
}

