import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { PostPlayerRequestDto } from './player.request.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async getPlayerByGroupId(@Query('groupId') groupId: number) {
    return this.playerService.getPlayerByGroupId(groupId);
  }

  @Get(':id')
  async getPlayerByPlayerId(@Param('id') id: number) {
    return this.playerService.getPlayerByPlayerId(id);
  }

  @Post()
  async createPlayer(@Body(ValidationPipe) dto: PostPlayerRequestDto) {
    return this.playerService.createPlayer(dto).catch((error) => {
      if (error.driverError.code === '23505') {
        throw new BadRequestException('Player already exists');
      }
      throw error;
    });
  }

  @Put(':id')
  async updatePlayer(
    @Param('id') id: number,
    @Body(ValidationPipe) dto: PostPlayerRequestDto,
  ) {
    return this.playerService.updatePlayer(id, dto);
  }

  @Delete(':id')
  async deletePlayer(
    @Param('id') id: number,
    @Query('groupId') groupId: number,
  ) {
    return this.playerService.deletePlayer(id, groupId);
  }

  @Get('total-games-played/:id')
  async getTotalGamesPlayed(@Param('id') id: number) {
    return this.playerService.getTotalGamesPlayed(id);
  }
}
