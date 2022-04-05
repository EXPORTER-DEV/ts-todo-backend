import { Transform, Type } from "class-transformer";
import { IsBoolean } from "class-validator";

export class PutTodoCompletedDto {
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    state: boolean = true;
}