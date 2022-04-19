import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule,
                JwtModule.register({
                    secret: 'test',
                }),
            ],
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findByEmail: jest.fn(),
                    }
                },
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((name) => {
                            switch(name){
                              case 'jwtSecret':
                                return 'test';
                                case 'jwtSecretExpires':
                                  return 120000;
                              case 'jwtRefreshSecret':
                                return 'test';
                              case 'jwtRefreshSecretExpires':
                                return 300000;
                            }
                        }),
                    }
                }
            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Checking password generation & comparing', () => {
        let originalPassword: string = 'test';
        let hashedPassword: string = null;
        it('Should generate hash password', async () => {
            hashedPassword = await service.generatePassword(originalPassword);
            expect(hashedPassword).toBeDefined();
        });
        it('Should original password doesnt equal hashed password', () => {
            expect(hashedPassword).not.toEqual(originalPassword);
        });
        it('Should validate original password with hashed', async () => {
            const result = await service.comparePassword(originalPassword, hashedPassword);
            expect(result).toBeTruthy();
        });
    });

    describe('Checking refresh token', () => {
        let refreshToken: string = null;
        let hash = 'test';
        it('Should create refresh token', async () => {
            const token = await service.generateRefreshToken(
                plainToClass(UserEntity, {email: 'test', id: 1}),
                hash
            );
            expect(token).toBeDefined();
            refreshToken = token;
        });
        it('Should validate refresh token', async () => {
            const result = await service.validateRefreshToken(refreshToken, hash);
            expect(result).toBeTruthy();
        });
    });
});
