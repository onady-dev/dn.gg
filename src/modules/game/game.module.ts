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
import { GameConnectPlayer } from "src/entities/GameConnectPlayer.entity";
import { GameConnectPlayerRepository } from "src/repository/gameConnectPlayer.repository";
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
        GameConnectPlayer,
        Log,
    ]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository, GameConnectPlayerRepository, LogRepository],
})
export class GameModule {}

