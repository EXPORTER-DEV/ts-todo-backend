import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "../../../../common/models/base-response.dto";
import { UserEntity } from "../user.entity";

export class UserEntityDto implements Partial<UserEntity> {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    created_at: number;
}

export class UserDto extends BaseResponseDto {
    status: boolean;
    @ApiProperty({
        type: UserEntityDto,
    })
    data?: UserEntityDto;
}