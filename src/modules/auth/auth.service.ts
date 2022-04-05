import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/models/user.entity';
import { ConfigService } from '@nestjs/config';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<UserEntity> | undefined> {
    const user = await this.userService.findByEmail(email);
    if(user !== undefined && this.comparePassword(password, user.password)){
      const { password, ...publicUser } = user;
      return publicUser;
    }
    return undefined;
  }

  async generatePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateRefreshToken(user: Partial<UserEntity>, hash: string): Promise<string> {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<string>("jwtRefreshSecret")}_${hash}`,
      expiresIn: this.configService.get<string>("jwtRefreshSecretExpires"),
    });
  }

  async decodeRefreshToken(token: string): Promise<number | false> {
    try {
      const decode = this.jwtService.decode(token);
      if(decode !== undefined && decode instanceof Object && decode.sub !== undefined){
        return +decode.sub;
      }
    }catch(e){}
    return false;
  }

  async validateRefreshToken(token: string, hash: string): Promise<boolean>{
    try {
      const verify = this.jwtService.verify(token, {
        secret: `${this.configService.get<string>("jwtRefreshSecret")}_${hash}`,
      });
      if(verify !== undefined && verify instanceof Object && verify.sub !== undefined){
        return true;
      }
    }catch(e){}
    return false;
  }

  async generateSessionToken(user: Partial<UserEntity>): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}