import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { GameRepository } from "src/repository/game.repository";
import { PostGameRequestDto } from "./game.request.dto";
import { Game } from "src/entities/Game.entity";
import { DataSource } from "typeorm";
import { GameConnectPlayer } from "src/entities/GameConnectPlayer.entity";
import { GameConnectPlayerRepository } from "src/repository/gameConnectPlayer.repository";
import { Log } from "src/entities/Log.entity";
import { LogRepository } from "src/repository/log.repository";

@Injectable()
export class GameService {
    constructor(
        private readonly gameRepository: GameRepository,
        private readonly gameConnectPlayerRepository: GameConnectPlayerRepository,
        private readonly logRepository: LogRepository,
        private dataSource: DataSource
    ) {}

    async getGames(groupId: number) {
        return this.gameRepository.findByGroupId(groupId);
    }

    async getGameById(id: number) {
        return this.gameRepository.findById(id);
    }

    async saveGame(dto: PostGameRequestDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const {groupId, homePlayers, awayPlayers, logs} = dto;
            const gameInstance = plainToInstance(Game, {groupId, date: new Date()});
            const {id: gameId} = await this.gameRepository.saveGame(gameInstance, queryRunner);

            const emptyGameConnectPlayer = this.gameConnectPlayerRepository.emptyGameConnectPlayer(groupId, gameId, queryRunner);
            const emptyLog = this.logRepository.emptyLog(groupId, gameId, queryRunner);
            const saveHomePlayers = homePlayers.map(({id: playerId}) => {
                const gcpInstance = plainToInstance(GameConnectPlayer, {groupId, gameId, playerId, team: 'home'});
                return this.gameConnectPlayerRepository.saveGameConnectPlayer(gcpInstance, queryRunner);
            })
            const saveAwayPlayers = awayPlayers.map(({id: playerId}) => {
                const gcpInstance = plainToInstance(GameConnectPlayer, {groupId, gameId, playerId, team: 'away'});
                return this.gameConnectPlayerRepository.saveGameConnectPlayer(gcpInstance, queryRunner);
            })
            const saveLogs = logs.map(({playerId, logitemId}) => {
                const logInstance = plainToInstance(Log, {groupId, gameId, playerId, logitemId});
                return this.logRepository.saveLog(logInstance, queryRunner);
            })
            await Promise.all([emptyGameConnectPlayer, emptyLog, ...saveHomePlayers, ...saveAwayPlayers, ...saveLogs]);

            await queryRunner.commitTransaction();
            return 
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}

