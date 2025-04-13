import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  //   @Post()
  //   async saveGame(@Body(ValidationPipe) dto: PostGameRequestDto) {
  //     return this.gameService.saveGame(dto);
  //   }

  @Delete(':id')
  async deleteGame(@Param('id') id: number) {
    return this.gameService.deleteGame(id);
  }

  @Post()
  async saveGameAndLogs(@Body(ValidationPipe) dto: PostGameAndLogsRequestDto) {
    return this.gameService.saveGameAndLogs(dto);
  }
}
