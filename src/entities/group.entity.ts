import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20 })
  name: string;
}

