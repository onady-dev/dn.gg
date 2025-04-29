import { Body, Controller, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { LogService } from './log.service';
import { PostLogRequestDto } from './log.request.dto';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async getLogByGroupId(@Query('groupId') groupId: number) {
    return this.logService.getLogByGroupId(groupId);
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
  async createLog(@Body(ValidationPipe) log: PostLogRequestDto) {
    return this.logService.createLog(log);
  }
}
