import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { from, lastValueFrom, Observable, of } from 'rxjs';
import { IS_GUEST } from '../decorators/guest.decorator';
import { IS_PUBLIC } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly configService: ConfigService, 
        private reflector: Reflector
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.configService.get<boolean>('isAuthEnabled')) {
            return true;
        }
        // Checking isPublic (resource available both for authenticated and for non authenticated):
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) {
            return true;
        }
        // Checking isGuest (resource available only for non authenticated users):
        const isGuest = this.reflector.getAllAndOverride<boolean>(IS_GUEST, [
            context.getHandler(),
            context.getClass()
        ]);
        
        let canActivate: boolean | Promise<boolean> | Observable<boolean> = false;
        let error: Error = undefined;

        try {
            canActivate = await super.canActivate(context);
        }catch(e){
            error = e;
        }
        if(canActivate instanceof Observable){
            canActivate = await lastValueFrom(canActivate);
        }
        // Check is resource has guess only (not authorized) permission:
        if(!canActivate && isGuest){
            // If JWT token auth failed, and isGuest decorator is used, then accepts only non-authorized users:
            return true;
        }else if(canActivate && isGuest){
            // If JWT token auth successfully, and isGuest decorator is used, then resource is forbidden (until user logout):
            return false;
        }
        // If error was detected above, then throw it:
        if(error !== undefined) throw error;
        return canActivate;
    }

    handleRequest(err, user, info: Error) {
        if (err) {
            throw err;
        }
        if (info) {
            throw new UnauthorizedException(info, info.message);
        }
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
