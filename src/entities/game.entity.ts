import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;
}

