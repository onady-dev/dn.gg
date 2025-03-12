import { Body, Controller, Get, Param, Post, Query, ValidationPipe } from "@nestjs/common";
import { GameService } from "./game.service";
import { PostGameRequestDto } from "./game.request.dto";

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

    @Post()
    async saveGame(@Body(ValidationPipe) dto: PostGameRequestDto) {
        return this.gameService.saveGame(dto);
    }
}
