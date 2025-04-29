import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GameRepository } from 'src/repository/game.repository';
import {
  PostGameAndLogsRequestDto,
  PostGameRequestDto,
} from './game.request.dto';
import { Game } from 'src/entities/Game.entity';
import { DataSource } from 'typeorm';
import { InGamePlayer } from 'src/entities/InGamePlayer.entity';
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
        homePlayers: homePlayers?.map((player) => ({
          id: player.playerId,
          name: player.player.name,
          team: player.team,
        })),
        awayPlayers: awayPlayers?.map((player) => ({
          id: player.playerId,
          name: player.player.name,
          team: player.team,
        })),
        logs: logs,
        status: game.status,
      };
    });
    const result = await Promise.all(gameInfo);
    return result;
  }

  async updateGameStatus(id: number, status: string) {
    return this.gameRepository.updateGameStatus(id, status);
  }

  async getGameById(id: number) {
    return this.gameRepository.findById(id);
  }

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
      
      // 게임 저장
      const { id: gameId } = await this.gameRepository.saveGame(
        gameInstance,
        queryRunner,
      );

      // 게임이 실제로 저장되었는지 확인
      const savedGame = await queryRunner.manager
        .getRepository(Game)
        .findOne({ where: { id: gameId } });
      if (!savedGame) {
        throw new Error('게임 저장에 실패했습니다.');
      }

      // 이후 작업 진행
      const emptyGameConnectPlayer = await this.inGamePlayersRepository.emptyInGamePlayers(
        groupId,
        gameId,
        queryRunner,
      );

      const emptyLog = await this.logRepository.emptyLog(
        groupId,
        gameId,
        queryRunner,
      );

      // 기존 데이터 삭제가 완료된 후에 새 데이터 삽입
      await Promise.all([emptyGameConnectPlayer, emptyLog]);

      // 홈 플레이어 저장
      for (const { id: playerId } of homePlayers) {
        const gcpInstance = plainToInstance(InGamePlayer, {
          groupId,
          gameId,
          playerId,
          team: 'home',
        });
        await this.inGamePlayersRepository.saveInGamePlayers(
          gcpInstance,
          queryRunner,
        );
      }

      // 어웨이 플레이어 저장
      for (const { id: playerId } of awayPlayers) {
        const gcpInstance = plainToInstance(InGamePlayer, {
          groupId,
          gameId,
          playerId,
          team: 'away',
        });
        await this.inGamePlayersRepository.saveInGamePlayers(
          gcpInstance,
          queryRunner,
        );
      }

      // 로그 저장
      for (const { playerId, logitemId } of logs) {
        const logInstance = plainToInstance(Log, {
          groupId,
          gameId,
          playerId,
          logitemId,
        });
        await this.logRepository.saveLog(logInstance, queryRunner);
      }

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
