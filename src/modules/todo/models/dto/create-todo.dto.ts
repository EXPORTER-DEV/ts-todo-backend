import { BaseResponseDto } from "../../../../common/models/base-response.dto";
import { TodoEntity } from "../todo.entity";

export class CreateTodoDto implements BaseResponseDto {
    status: boolean;
    data?: TodoEntity;
}