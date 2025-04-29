import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  PostGameAndLogsRequestDto,
  PostGameRequestDto,
} from './game.request.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGameByGroupId(@Query('groupId') groupId: number) {
    return this.gameService.getGames(groupId);
  }

  @Patch(':id')
  async updateGameStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.gameService.updateGameStatus(id, status);
  }

  @Delete(':id')
  async deleteGame(@Param('id') id: number) {
    return this.gameService.deleteGame(id);
  }

  @Post()
  async saveGameAndLogs(@Body(ValidationPipe) dto: PostGameAndLogsRequestDto) {
    return this.gameService.saveGameAndLogs(dto);
  }
}
