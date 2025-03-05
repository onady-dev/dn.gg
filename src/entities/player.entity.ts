import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20 })
  name: string;
}

