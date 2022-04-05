import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { BaseResponse } from '../../common/models/base-response';
import { CreateTodoDto } from './models/dto/create-todo.dto';
import { PostCreateTodoDto } from './models/dto/post-create-todo.dto';
import { PutTodoCompletedDto } from './models/dto/put-todo-completed.dto';
import { TodoListDto } from './models/dto/todo-list.dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(
        private readonly todoService: TodoService
    ){}

    @Get()
    async getTodos(@Req() request: Request): Promise<TodoListDto>{
        const todos = await this.todoService.findAllByUser(request.user.id);
        return plainToClass(TodoListDto, {status: true, data: todos});
    }

    @Post('create')
    async createTodo(@Req() request: Request, @Body() data: PostCreateTodoDto): Promise<CreateTodoDto> {
        if(data.scheduled !== undefined && data.scheduled < Date.now()){
            throw new BadRequestException("Scheduled timestamp should be in future");
        }
        const created = await this.todoService.create(data, request.user.id);
        return plainToClass(CreateTodoDto, {
            status: true,
            data: created
        });
    }

    @Put(':todoId/completed')
    async setCompleted(@Req() request: Request, @Param('todoId') todoId: number, @Query() query: PutTodoCompletedDto): Promise<BaseResponse> {
        const status = await this.todoService.setCompleted(todoId, query.state, request.user.id);
        return plainToClass(BaseResponse, {
            status,
        });
    }
}
