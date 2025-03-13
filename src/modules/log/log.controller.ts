import { Controller, Get, Param, Query } from "@nestjs/common";
import { LogService } from "./log.service";

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

}
