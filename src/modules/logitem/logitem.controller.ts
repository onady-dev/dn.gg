import { Body, Controller, Get, Param, Post, Query, ValidationPipe } from "@nestjs/common";
import { LogitemService } from "./logitem.service";
import { PostLogitemRequestDto } from "./logitem.request.dto";

@Controller('logitem')
export class LogitemController {
    constructor(private readonly logitemService: LogitemService) {}

    @Get()
    async getLogitemByGroupId(@Query('groupId') groupId: number) {
        return this.logitemService.getLogitemByGroupId(groupId);
    }

    @Post()
    async createLogitem(@Body(ValidationPipe) logitem: PostLogitemRequestDto) {
        return this.logitemService.createLogitem(logitem);
    }
}
