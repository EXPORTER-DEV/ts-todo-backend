import { IsEmail, IsString, MinLength } from "class-validator";

export class PostUserRegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    password: string;

    @IsString()
    firstname: string;

    @IsString()
    lastname: string;
}