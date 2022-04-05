import { IUserJWT } from "./modules/user/models/user.interface";

declare module "express" {
    interface Request {
        user: IUserJWT;
    }
}