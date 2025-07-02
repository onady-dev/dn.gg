
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "src/entities/Game.entity";
import { QueryRunner, Repository } from "typeorm";

export class GameRepository extends Repository<Game>{
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
    ) {
        super(gameRepository.target, gameRepository.manager, gameRepository.queryRunner);
    }

    async findByGroupId(groupId: number): Promise<Game[] | null> {
        return this.gameRepository.createQueryBuilder('game')
            .where('game."groupId" = :groupId', { groupId })
            .andWhere('game."status" != :status', { status: 'DELETED' })
            .orderBy('game."id"', 'DESC')
            .getMany();
    }

    async findById(id: number): Promise<Game | null> {
        return this.gameRepository.findOne({
            where: {
                id,
            },
            relations: ['inGamePlayers', 'logs', 'inGamePlayers.player'],
        });
    }

    async saveGame(game: Game, queryRunner: QueryRunner): Promise<Game> {
        return queryRunner.manager.save(Game, game);
    }

    async deleteGame(id: number) {
        return this.gameRepository.update(id, { status: 'DELETED' });
    }

    async updateGameStatus(id: number, status: string) {
        return this.gameRepository.update(id, { status: status as 'IN_PROGRESS' | 'FINISHED' });
    }
}
