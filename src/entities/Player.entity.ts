import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { InGamePlayers } from "./InGamePlayers.entity";
import { Log } from "./Log.entity";
@Entity()
@Unique(["groupId", "name"])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  groupId: number;
  @Column('varchar', { length: 20 })
  name: string;
  @Column('varchar', { length: 20, nullable: true })
  backnumber: string;
  
  @OneToMany(() => InGamePlayers, (inGamePlayers) => inGamePlayers.player)
  inGamePlayers: InGamePlayers[];
  @OneToMany(() => Log, (log) => log.player)
  logs: Log[];
}

