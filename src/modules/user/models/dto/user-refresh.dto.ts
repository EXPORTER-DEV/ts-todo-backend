import { BaseResponseDto } from "../../../../common/models/base-response.dto";

export class UserRefreshDto extends BaseResponseDto {
    status: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
    }
}