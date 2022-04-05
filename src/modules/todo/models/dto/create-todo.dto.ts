import { BaseResponse } from "../../../../common/models/base-response";
import { TodoEntity } from "../todo.entity";

export class CreateTodoDto implements BaseResponse {
    status: boolean;
    data?: TodoEntity;
}