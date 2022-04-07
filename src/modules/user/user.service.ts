import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from './models/user.entity';
import { IUserLoginResult, IUserTokens } from './models/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ){}
    async login(email: string, password: string): Promise<IUserLoginResult | false> {
        const user = await this.authService.validateUser(email, password);
        if(user !== undefined){
            if(user.refresh_hash === undefined){
                user.refresh_hash = await bcrypt.genSalt(10);
                await this.userRepository.save(user);
            }
            const access_token = await this.authService.generateSessionToken(user);
            const refresh_token = await this.authService.generateRefreshToken(user, user.refresh_hash);
            return {
                user,
                refresh_token: refresh_token,
                access_token: access_token,
            }
        }
        return false;
    }
    async refresh(token: string): Promise<IUserTokens | false> {
        const decode = await this.authService.decodeRefreshToken(token);
        if(decode !== false){
            const user = await this.findById(decode);
            if(user !== undefined){
                const validate = await this.authService.validateRefreshToken(token, user.refresh_hash);
                if(validate === true){
                    user.refresh_hash = await bcrypt.genSalt(10);
                    try {
                        await this.userRepository.save(user);
                        const access_token = await this.authService.generateSessionToken(user);
                        const refresh_token = await this.authService.generateRefreshToken(user, user.refresh_hash);
                        return {
                            refresh_token: refresh_token,
                            access_token: access_token,
                        }
                    }catch(e){
                        this.logger.error(e.message, e.stack);
                    }
                }
            }
        }
        return false;
    }
    async register(email: string, password: string, firstname: string, lastname: string): Promise<boolean> {
        const checkExists = await this.findByEmail(email);
        if(checkExists === undefined){
            const passwordHash = await this.authService.generatePassword(password);
            const user = plainToClass(UserEntity, {
                email,
                password: passwordHash,
                firstname,
                lastname
            });
            try {
                this.userRepository.save(user);
                return true;
            }catch(e){
                this.logger.error(e.message, e.stack);
                throw new InternalServerErrorException();
            }
        }
        return false;
    }
    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({
            email,
        });
    }
    async findById(id: number): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({
            id
        });
    }
}
