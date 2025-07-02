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
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  PostGameAndLogsRequestDto,
  PostGameRequestDto,
} from './game.request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGameByGroupId(@Query('groupId') groupId: number) {
    return this.gameService.getGames(groupId);
  }

  @Get(':id')
  async getGameById(@Param('id') id: number) {
    return this.gameService.getGameById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateGameStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.gameService.updateGameStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteGame(@Param('id') id: number, @Query('groupId') groupId: number) {
    return this.gameService.deleteGame(id, groupId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async saveGameAndLogs(@Body(ValidationPipe) dto: PostGameAndLogsRequestDto) {
    return this.gameService.saveGameAndLogs(dto);
  }
}
