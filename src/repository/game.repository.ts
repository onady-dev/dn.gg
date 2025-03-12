
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

    async findByGroupId(groupId: number): Promise<Game | null> {
        return this.gameRepository.findOne({
            where: {
                groupId,
            },
        });
    }

    async findById(id: number): Promise<Game | null> {
        return this.gameRepository.createQueryBuilder('game')
            .leftJoinAndSelect('game.gameConnectPlayers', 'gameConnectPlayers')
            .leftJoinAndSelect('gameConnectPlayers.player', 'player')
            .leftJoinAndSelect('game.logs', 'logs')
            .leftJoinAndSelect('logs.logitem', 'logitem')
            .where('game.id = :id', { id })
            .getOne();
    }

    async saveGame(game: Game, queryRunner: QueryRunner): Promise<Game> {
        return queryRunner.manager.save(Game, game);
    }
}
