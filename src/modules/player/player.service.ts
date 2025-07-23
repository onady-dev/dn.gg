import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PostPlayerRequestDto } from './player.request.dto';
import { PlayerRepository } from 'src/repository/player.repository';
import { Player } from 'src/entities/Player.entity';
import { QueryFailedError } from 'typeorm';
import { InGamePlayersRepository } from 'src/repository/inGamePlayers.repository';

@Injectable()
export class PlayerService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly inGamePlayersRepository: InGamePlayersRepository,
  ) {}

  async getPlayerByGroupId(groupId: number) {
    return this.playerRepository.findByGroupId(groupId);
  }

  async getPlayerByPlayerId(id: number) {
    return this.playerRepository.findById(id);
  }

  async createPlayer(dto: PostPlayerRequestDto) {
    const playerInstance = plainToInstance(Player, { ...dto });
    return await this.playerRepository.savePlayer(playerInstance);
  }

  async updatePlayer(id: number, dto: PostPlayerRequestDto) {
    const playerInstance = plainToInstance(Player, { ...dto });
    await this.playerRepository.updatePlayer(id, playerInstance);
    return await this.playerRepository.findById(id);
  }

  async deletePlayer(id: number, groupId: number) {
    return await this.playerRepository.deletePlayer(id);
  }

  async getTotalGamesPlayed(id: number) {
    const test = await this.inGamePlayersRepository.getTotalGamesPlayed(id);
    console.log(id);
    return test;
  }
}
