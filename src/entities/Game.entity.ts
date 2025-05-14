import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InGamePlayer } from "./InGamePlayer.entity";
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
  @Column({ 
    type: 'varchar', 
    default: 'IN_PROGRESS',
    comment: 'IN_PROGRESS | FINISHED',
    enum: ['IN_PROGRESS', 'FINISHED'] 
  })
  status: 'IN_PROGRESS' | 'FINISHED';

  @OneToMany(() => InGamePlayer, (inGamePlayers) => inGamePlayers.game)
  inGamePlayers: InGamePlayer[];
  @OneToMany(() => Log, (log) => log.game)
  logs: Log[];
}

