import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PostPlayerRequestDto } from './player.request.dto';
import { PlayerRepository } from 'src/repository/player.repository';
import { Player } from 'src/entities/Player.entity';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async getPlayerByGroupId(groupId: number) {
    return this.playerRepository.findByGroupId(groupId);
  }

  async createPlayer(dto: PostPlayerRequestDto) {
    const playerInstance = plainToInstance(Player, { ...dto });
    await this.playerRepository.savePlayer(playerInstance);
    return this.playerRepository.findByGroupId(dto.groupId);
  }

  async updatePlayer(id: number, dto: PostPlayerRequestDto) {
    const playerInstance = plainToInstance(Player, { ...dto });
    await this.playerRepository.updatePlayer(id, playerInstance);
    return this.playerRepository.findByGroupId(dto.groupId);
  }

  async deletePlayer(id: number, groupId: number) {
    await this.playerRepository.deletePlayer(id);
    return this.playerRepository.findByGroupId(groupId);
  }
}
