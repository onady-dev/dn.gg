
import { InjectRepository } from "@nestjs/typeorm";
import { InGamePlayers } from "src/entities/InGamePlayers.entity";
import { QueryRunner, Repository } from "typeorm";

export class InGamePlayersRepository extends Repository<InGamePlayers>{
    constructor(
        @InjectRepository(InGamePlayers)
        private inGamePlayersRepository: Repository<InGamePlayers>,
    ) {
        super(inGamePlayersRepository.target, inGamePlayersRepository.manager, inGamePlayersRepository.queryRunner);
    }

    async findPlayers(groupId: number, gameId: number, team: string): Promise<InGamePlayers[] | null> {
        return this.inGamePlayersRepository.find({
            where: {
                groupId,
                gameId,
                team,
            },
            relations: ['player'],
        });
    }

    async emptyInGamePlayers(groupId: number, gameId: number, queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(InGamePlayers, { groupId, gameId });
    }

    async saveInGamePlayers(inGamePlayers: InGamePlayers, queryRunner: QueryRunner): Promise<InGamePlayers> {
        return queryRunner.manager.save(InGamePlayers, inGamePlayers);
    }
}
