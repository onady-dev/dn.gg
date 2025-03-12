
import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "src/entities/Log.entity";
import { QueryRunner, Repository } from "typeorm";

export class LogRepository extends Repository<Log>{
    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>,
    ) {
        super(logRepository.target, logRepository.manager, logRepository.queryRunner);
    }

    async findByGroupId(groupId: number): Promise<Log | null> {
        return this.logRepository.findOne({
            where: {
                groupId,
            },
        });
    }

    async findByGameId(gameId: number): Promise<Log | null> {
        return this.logRepository.findOne({
            where: {
                gameId,
            },
        });
    }

    async findByPlayerId(playerId: number): Promise<Log | null> {
        return this.logRepository.findOne({
            where: {
                playerId,
            },
        });
    }

    async findByLogitemId(logitemId: number): Promise<Log | null> {
        return this.logRepository.findOne({
            where: {
                logitemId,
            },
        });
    }
    
    async emptyLog(groupId: number, gameId: number, queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(Log, { groupId, gameId });
    }

    async saveLog(log: Log, queryRunner: QueryRunner): Promise<Log> {
        return queryRunner.manager.save(Log, log);
    }
}
