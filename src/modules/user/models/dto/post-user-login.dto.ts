import { IsEmail, IsString } from "class-validator";

export class PostUserLoginDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}