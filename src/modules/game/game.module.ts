import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "src/entities/Game.entity";
import { Group } from "src/entities/Group.entity";
import { Player } from "src/entities/Player.entity";
import { GameRepository } from "src/repository/game.repository";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { Logitem } from "src/entities/Logitem.entity";
import { Log } from "src/entities/Log.entity";
import { InGamePlayers } from "src/entities/InGamePlayers.entity";
import { InGamePlayersRepository } from "src/repository/inGamePlayers.repository";
import { LogRepository } from "src/repository/log.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".env",
    }),
    TypeOrmModule.forFeature([
        Game,
        Logitem,
        Player,
        Group,
        InGamePlayers,
        Log,
    ]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository, InGamePlayersRepository, LogRepository],
})
export class GameModule {}

