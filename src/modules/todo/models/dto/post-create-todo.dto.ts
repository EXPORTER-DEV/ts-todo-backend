import { Type } from "class-transformer";
import { IsIn, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class PostCreateTodoDto {
    @IsString()
    content: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    scheduled: number;
}