import { BaseResponse } from "../../../../common/models/base-response";
import { TodoEntity } from "../todo.entity";

export class TodoListDto implements BaseResponse {
    status: boolean;
    data?: TodoEntity[];
}