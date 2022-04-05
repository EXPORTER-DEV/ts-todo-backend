import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import configuration from './common/config/configuration';
import { validate } from './common/config/validate';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { TodoModule } from './modules/todo/todo.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => Object.assign(await getConnectionOptions(), {
        logging: true,
      }),
    }),
    UserModule,
    TodoModule,
  ],
  providers: [
    ConsoleLogger,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class MainModule {}
