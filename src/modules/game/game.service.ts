import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GameRepository } from 'src/repository/game.repository';
import {
  PostGameAndLogsRequestDto,
  PostGameRequestDto,
} from './game.request.dto';
import { Game } from 'src/entities/Game.entity';
import { DataSource } from 'typeorm';
import { InGamePlayers } from 'src/entities/InGamePlayers.entity';
import { InGamePlayersRepository } from 'src/repository/inGamePlayers.repository';
import { Log } from 'src/entities/Log.entity';
import { LogRepository } from 'src/repository/log.repository';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly inGamePlayersRepository: InGamePlayersRepository,
    private readonly logRepository: LogRepository,
    private dataSource: DataSource,
  ) {}

  async getGames(groupId: number) {
    const games: Game[] | null =
      await this.gameRepository.findByGroupId(groupId);
    if (!games) return [];
    const gameInfo = games.map(async (game: Game) => {
      const homePlayers = await this.inGamePlayersRepository.findPlayers(
        groupId,
        game.id,
        'home',
      );
      const awayPlayers = await this.inGamePlayersRepository.findPlayers(
        groupId,
        game.id,
        'away',
      );
      const logs = await this.logRepository.findLogsByGameId(game.id);
      return {
        id: game.id,
        date: game.date,
        name: game.name,
        homePlayers: homePlayers,
        awayPlayers: awayPlayers,
        logs: logs,
      };
    });
    const result = await Promise.all(gameInfo);
    return result;
  }

  async getGameById(id: number) {
    return this.gameRepository.findById(id);
  }

  // async saveGame(dto: PostGameRequestDto) {
  //   const gameInstance = plainToInstance(Game, {
  //     groupId: dto.groupId,
  //     date: new Date(),
  //     name: dto.name,
  //   });
  //   return this.gameRepository.saveGame(gameInstance);
  // }

  async deleteGame(id: number) {
    return this.gameRepository.deleteGame(id);
  }

  async saveGameAndLogs(dto: PostGameAndLogsRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id, groupId, homePlayers, awayPlayers, name, logs } = dto;
      const gameInstance = plainToInstance(Game, {
        id,
        groupId,
        date: new Date(),
        name,
      });
      const { id: gameId } = await this.gameRepository.saveGame(
        gameInstance,
        queryRunner,
      );

      const emptyGameConnectPlayer =
        this.inGamePlayersRepository.emptyInGamePlayers(
          groupId,
          gameId,
          queryRunner,
        );
      const emptyLog = this.logRepository.emptyLog(
        groupId,
        gameId,
        queryRunner,
      );
      const saveHomePlayers = homePlayers.map(({ id: playerId }) => {
        const gcpInstance = plainToInstance(InGamePlayers, {
          groupId,
          gameId,
          playerId,
          team: 'home',
        });
        return this.inGamePlayersRepository.saveInGamePlayers(
          gcpInstance,
          queryRunner,
        );
      });
      const saveAwayPlayers = awayPlayers.map(({ id: playerId }) => {
        const gcpInstance = plainToInstance(InGamePlayers, {
          groupId,
          gameId,
          playerId,
          team: 'away',
        });
        return this.inGamePlayersRepository.saveInGamePlayers(
          gcpInstance,
          queryRunner,
        );
      });
      const saveLogs = logs.map(({ playerId, logitemId }) => {
        const logInstance = plainToInstance(Log, {
          groupId,
          gameId,
          playerId,
          logitemId,
        });
        return this.logRepository.saveLog(logInstance, queryRunner);
      });
      await Promise.all([
        emptyGameConnectPlayer,
        emptyLog,
        ...saveHomePlayers,
        ...saveAwayPlayers,
        ...saveLogs,
      ]);

      await queryRunner.commitTransaction();
      return { gameId };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
