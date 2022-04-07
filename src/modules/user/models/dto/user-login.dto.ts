import { BaseResponseDto } from "../../../../common/models/base-response.dto";
import { UserEntity } from "../user.entity";

export class UserLoginDto extends BaseResponseDto {
    status: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
        user: Partial<UserEntity>
    }
}