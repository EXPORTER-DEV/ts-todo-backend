import { BaseResponse } from "../../../../common/models/base-response";
import { UserEntity } from "../user.entity";

export class UserLoginDto extends BaseResponse {
    status: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
        user: Partial<UserEntity>
    }
}