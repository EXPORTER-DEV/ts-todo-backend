import { BaseResponse } from "../../../../common/models/base-response";

export class UserRefreshDto extends BaseResponse {
    status: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
    }
}