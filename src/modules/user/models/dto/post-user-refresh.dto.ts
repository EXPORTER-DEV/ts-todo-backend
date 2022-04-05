import { IsEmail, IsString } from "class-validator";

export class PostUserRefreshDto {
    @IsString()
    token: string;
}