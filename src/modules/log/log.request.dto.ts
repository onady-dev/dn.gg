import { IsNotEmpty, IsString } from "class-validator";

export class PostLogRequestDto {
    @IsNotEmpty()
    @IsString()
    groupId: string;
    @IsNotEmpty()
    @IsString()
    gameId: string;
    @IsNotEmpty()
    @IsString()
    playerId: string;
    @IsNotEmpty()
    @IsString()
    logitemId: string;
}
