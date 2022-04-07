
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { BaseResponseDto } from '../models/base-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        
        const { message, stack, name } = exception;

        this.logger.error(message, stack);

        let data: undefined | Object = undefined;

        const exceptionResponse: string | Record<string, any> = exception.getResponse();
        if(exceptionResponse instanceof Object && exceptionResponse.message instanceof Object){
            data = exceptionResponse.message;
        }

        const baseResponse = plainToClass(BaseResponseDto, {
            status: false,
            message: `${name}: ${message}`,
            data,
        });

        response
            .status(status)
            .json(baseResponse);
    }
}