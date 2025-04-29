import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/entities/Log.entity';
import { QueryRunner, Repository } from 'typeorm';

export class LogRepository extends Repository<Log> {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {
    super(
      logRepository.target,
      logRepository.manager,
      logRepository.queryRunner,
    );
  }

  async findLogsByGameId(gameId: number): Promise<Log[] | null> {
    return this.logRepository.find({
      where: {
        gameId,
      },
      relations: ['logitem', 'player', 'game'],
    });
  }

  async findByGroupId(groupId: number): Promise<Log[] | null> {
    return this.logRepository.find({
      where: {
        groupId,
      },
      relations: ['logitem', 'player'],
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

  async findLastLogByGameId(gameId: number): Promise<Log | null> {
    return this.logRepository.findOne({
      where: {
        gameId,
      },
      order: {
        sequence: 'DESC',
      },
    });
  }

  async findLogByGameIdAndSequence(gameId: number, sequence: number): Promise<Log | null> {
    return this.logRepository.findOne({
      where: {
        gameId,
        sequence,
      },
      relations: ['logitem', 'player', 'game'],
    });
  }

  async removeLog(id: number): Promise<void> {
    await this.logRepository.delete(id);
  }

  async emptyLog(
    groupId: number,
    gameId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.delete(Log, { groupId, gameId });
  }

  async saveLog(log: Log, queryRunner: QueryRunner): Promise<Log> {
    return queryRunner.manager.save(Log, log);
  }

  async findByLogItemIdAndGroupId(
    logitemId: number,
    groupId: number,
  ): Promise<Log[] | null> {
    return this.logRepository.find({
      where: {
        logitemId,
        groupId,
      },
      relations: ['logitem', 'player', 'game'],
    });
  }

  async createLog(log: Log) {
    return this.logRepository.save(log);
  }
}
