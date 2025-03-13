import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InGamePlayers } from "./InGamePlayers.entity";
import { Log } from "./Log.entity";
@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  groupId: number;
  @Column('date')
  date: Date;
  @Column('varchar', { length: 20 })
  name: string;
  
  @OneToMany(() => InGamePlayers, (inGamePlayers) => inGamePlayers.game)
  inGamePlayers: InGamePlayers[];
  @OneToMany(() => Log, (log) => log.game)
  logs: Log[];
}

