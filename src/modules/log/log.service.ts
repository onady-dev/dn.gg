import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LogRepository } from 'src/repository/log.repository';
import { PostLogRequestDto } from './log.request.dto';
import { plainToInstance } from 'class-transformer';
import { Log } from 'src/entities/Log.entity';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async getLogByGroupId(groupId: number) {
    return this.logRepository.findByGroupId(groupId);
  }

  async getLogByGameId(gameId: number) {
    return this.logRepository.findLogsByGameId(gameId);
  }

  async getLogByPlayerId(playerId: number) {
    return this.logRepository.findByPlayerId(playerId);
  }

  async getLogByLogitemId(logitemId: number) {
    return this.logRepository.findByLogitemId(logitemId);
  }

  async getLogByLogItemIdAndGroupId(logitemId: number, groupId: number) {
    return this.logRepository.findByLogItemIdAndGroupId(logitemId, groupId);
  }

  async createLog(log: PostLogRequestDto) {
    // 현재 게임의 마지막 시퀀스 번호 조회
    const lastLog = await this.logRepository.findLastLogByGameId(log.gameId);
    const sequence = lastLog ? lastLog.sequence + 1 : 1;

    const logInstance = plainToInstance(Log, { ...log, sequence });
    return this.logRepository.createLog(logInstance);
  }

  async undoLastLog(gameId: number) {
    // 게임의 마지막 로그 조회
    const lastLog = await this.logRepository.findLastLogByGameId(gameId);
    if (!lastLog) {
      throw new Error('되돌릴 로그가 없습니다.');
    }

    // 로그 삭제
    await this.logRepository.removeLog(lastLog.id);
    return lastLog;
  }

  async redoLog(gameId: number, sequence: number) {
    // 특정 시퀀스의 로그 복원
    const log = await this.logRepository.findLogByGameIdAndSequence(gameId, sequence);
    if (!log) {
      throw new HttpException('복원할 로그를 찾을 수 없습니다.', HttpStatus.BAD_REQUEST);
    }
    // 새로운 로그 생성 (마지막 시퀀스 + 1)
    const lastLog = await this.logRepository.findLastLogByGameId(gameId);
    const newSequence = lastLog ? lastLog.sequence + 1 : 1;

    const newLog = plainToInstance(Log, {
      ...log,
      sequence: newSequence,
      id: undefined // 새로운 ID 생성을 위해 undefined 설정
    });

    return this.logRepository.createLog(newLog);
  }
}
