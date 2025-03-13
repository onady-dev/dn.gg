import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PostGameRequestDto {
    @IsOptional()
    @IsNumber()
    id: number;
    @IsNotEmpty()
    @IsNumber()
    groupId: number;
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsArray()
    homePlayers: HomePlayer[];
    @IsNotEmpty()
    @IsArray()
    awayPlayers: AwayPlayer[];
    @IsOptional()
    @IsArray()
    logs: Log[];
}

class HomePlayer {
    @IsNumber()
    id: number;
}

class AwayPlayer {
    @IsNumber()
    id: number;
}

class Log {
    @IsNumber()
    playerId: number;
    @IsNumber()
    logitemId: number;
}
