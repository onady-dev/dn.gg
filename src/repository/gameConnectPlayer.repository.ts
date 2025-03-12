
import { InjectRepository } from "@nestjs/typeorm";
import { GameConnectPlayer } from "src/entities/GameConnectPlayer.entity";
import { QueryRunner, Repository } from "typeorm";

export class GameConnectPlayerRepository extends Repository<GameConnectPlayer>{
    constructor(
        @InjectRepository(GameConnectPlayer)
        private gameConnectPlayerRepository: Repository<GameConnectPlayer>,
    ) {
        super(gameConnectPlayerRepository.target, gameConnectPlayerRepository.manager, gameConnectPlayerRepository.queryRunner);
    }

    async findByGroupId(groupId: number): Promise<GameConnectPlayer | null> {
        return this.gameConnectPlayerRepository.findOne({
            where: {
                groupId,
            },
        });
    }

    async emptyGameConnectPlayer(groupId: number, gameId: number, queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(GameConnectPlayer, { groupId, gameId });
    }

    async saveGameConnectPlayer(gameConnectPlayer: GameConnectPlayer, queryRunner: QueryRunner): Promise<GameConnectPlayer> {
        return queryRunner.manager.save(GameConnectPlayer, gameConnectPlayer);
    }
}
