import { Body, Controller, Delete, Get, Param, Post, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { GetLogByDailyRequestDto, PostLogRequestDto } from './log.request.dto';
import { Player } from 'src/entities/Player.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async getLogByGroupId(@Query('groupId') groupId: number) {
    return this.logService.getLogByGroupId(groupId);
  }

  @Get('/daily')
  async getLogByDaily(@Query(ValidationPipe) dto: GetLogByDailyRequestDto) {
    return await this.logService.getLogByDaily(dto.date);
  }

  @Get('/game/:id')
  async getLogByGameId(@Param('id') id: number) {
    return this.logService.getLogByGameId(id);
  }

  @Get('/player/:id')
  async getLogByPlayerId(@Param('id') id: number) {
    return this.logService.getLogByPlayerId(id);
  }

  @Get('/logitem')
  async getLogByLogId(
    @Query('groupId') groupId: number,
    @Query('logitemId') logitemId: number,
  ) {
    return this.logService.getLogByLogItemIdAndGroupId(logitemId, groupId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createLog(@Body(ValidationPipe) log: PostLogRequestDto) {
    return this.logService.createLog(log);
  }

  @Delete('/game/:id/undo')
  @UseGuards(AuthGuard('jwt'))
  async undoLastLog(@Param('id') gameId: number) {
    return this.logService.undoLastLog(gameId);
  }

  @Post('/game/:id/redo')
  @UseGuards(AuthGuard('jwt'))
  async redoLog(
    @Param('id') gameId: number,
    @Body('sequence') sequence: number,
  ) {
    return this.logService.redoLog(gameId, sequence);
  }
}
