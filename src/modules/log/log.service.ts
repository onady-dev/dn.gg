import { Injectable } from "@nestjs/common";
import { LogRepository } from "src/repository/log.repository";

@Injectable()
export class LogService {
    constructor(
        private readonly logRepository: LogRepository,
    ) {}

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
}

