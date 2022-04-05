import { BaseResponse } from "../../../../common/models/base-response";
import { UserEntity } from "../user.entity";

export class UserDto extends BaseResponse {
    status: boolean;
    data?: Partial<UserEntity>;
}