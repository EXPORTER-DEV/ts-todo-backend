import { UserEntity } from "./user.entity";

export interface IUserLoginResult extends IUserTokens {
    user: Partial<UserEntity>;
}

export interface IUserTokens {
    access_token: string;
    refresh_token: string;
}

export interface IUserJWT {
    id: number;
    email: string;
}