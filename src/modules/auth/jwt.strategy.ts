import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserJWT } from '../user/models/user.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			signOptions: {
				expiresIn: configService.get<string>('jwtSecretExpires'),
			},
			secretOrKey: configService.get<string>('jwtSecret'),
		});
	}

	async validate(payload: any): Promise<IUserJWT> {
		// Check is user exists:
		const user = await this.userService.findById(payload.sub);
		if(user === undefined){
			return undefined;
		}
		return { id: payload.sub, email: payload.email };
	}
}