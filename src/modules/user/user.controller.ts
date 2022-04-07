import { Body, Controller, ForbiddenException, Get, NotFoundException, Post, Request, ServiceUnavailableException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseResponseDto } from '../../common/models/base-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { PostUserLoginDto } from './models/dto/post-user-login.dto';
import { UserLoginDto } from './models/dto/user-login.dto';
import { UserService } from './user.service';
import { PostUserRegisterDto } from './models/dto/post-user-register.dto';
import { Guest } from '../auth/decorators/guest.decorator';
import { PostUserRefreshDto } from './models/dto/post-user-refresh.dto';
import { UserRefreshDto } from './models/dto/user-refresh.dto';
import { UserDto } from './models/dto/user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}
    @Guest()
    @Post('/login')
    async login(@Body() data: PostUserLoginDto): Promise<UserLoginDto> {
        const login = await this.userService.login(data.email, data.password);
        if(login !== false){
            return plainToClass(UserLoginDto, {
                status: true,
                data: {
                    access_token: login.access_token,
                    refresh_token: login.refresh_token,
                    user: login.user,
                }
            })
        }
        return plainToClass(BaseResponseDto, {
            status: false,
        });
    }
    @Guest()
    @Post('/refresh')
    async refresh(@Body() data: PostUserRefreshDto): Promise<UserRefreshDto> {
        const result = await this.userService.refresh(data.token);
        if(result !== false){
            return plainToClass(UserRefreshDto, {
                status: true,
                data: {
                    access_token: result.access_token,
                    refresh_token: result.refresh_token,
                }
            });
        }
        throw new UnauthorizedException();
    }
    @Guest()
    @Post('/register')
    async register(@Body() data: PostUserRegisterDto): Promise<BaseResponseDto>{
        const register = await this.userService.register(data.email, data.password, data.firstname, data.lastname);
        return plainToClass(BaseResponseDto, {
            status: register,
        });
    }
    @Get('/info')
    async info(@Request() req): Promise<UserDto> {
        const {password, refresh_hash, ...user} = await this.userService.findById(req.user.id);
        if(user !== undefined){
            return plainToClass(UserDto, {
                status: true,
                data: user,
            });
        }else{
            throw new ForbiddenException();
        }
    }
}
