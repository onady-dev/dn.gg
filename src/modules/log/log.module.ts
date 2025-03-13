import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "src/entities/Game.entity";
import { Group } from "src/entities/Group.entity";
import { Player } from "src/entities/Player.entity";
import { LogService } from "./log.service";
import { LogController } from "./log.controller";
import { Logitem } from "src/entities/Logitem.entity";
import { LogRepository } from "src/repository/log.repository";
import { Log } from "src/entities/Log.entity";

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
        Log,
    ]),
  ],
  controllers: [LogController],
  providers: [LogService, LogRepository],
})
export class LogModule {}

