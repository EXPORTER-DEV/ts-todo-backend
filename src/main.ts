import { ConsoleLogger, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(MainModule, {
		logger: ['debug', 'error', 'verbose', 'warn', 'log'],
		cors: true,
	});
	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		disableErrorMessages: true,
	}));
	app.useGlobalFilters(new HttpExceptionFilter());
	app.use(helmet());
	const logger = app.get(ConsoleLogger);
	const config = app.get(ConfigService);
	//
	const isProduction = config.get<boolean>('isProduction');
	const isAuthEnabled = config.get<boolean>('isAuthEnabled');
	const port = config.get<number>('port');
	if(!isProduction){
		const swaggerUrl = `swagger`;
		const swaggerConfig = new DocumentBuilder()
		.setTitle('TS Todo Backend')
		.setDescription('Todo application API description')
		.setVersion(config.get<string>('version'))
		.build();
		const document = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup(swaggerUrl, app, document);
		logger.log(`Running swagger on: /${swaggerUrl}`);
	}
	logger.log(`Running on ${port} port in ${isProduction ? 'production' : 'development'} mode, authentication ${isAuthEnabled ? 'enabled' : 'disabled'}.`);
	await app.listen(port);
}
bootstrap();
