import { Injectable } from '@nestjs/common';
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
    const logInstance = plainToInstance(Log, log);
    return this.logRepository.createLog(logInstance);
  }
}
