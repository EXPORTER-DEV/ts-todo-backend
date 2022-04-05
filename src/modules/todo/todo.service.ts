import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { PostCreateTodoDto } from './models/dto/post-create-todo.dto';
import { TodoEntity } from './models/todo.entity';

@Injectable()
export class TodoService {
    private readonly logger = new Logger(TodoService.name);
    constructor(
        @InjectRepository(TodoEntity)
        private readonly todoRepository: Repository<TodoEntity>
    ){}
    async findAllByUser(user: number): Promise<TodoEntity[]> {
        return this.todoRepository
            .createQueryBuilder("todo")
            .where("todo.userId = :user", {user})
            .getMany();
    }
    async findByIdAndUser(id: number, user: number): Promise<TodoEntity | undefined> {
        const todo = this.todoRepository
            .createQueryBuilder("todo")
            .where("todo.userId = :user AND todo.id = :id", {user, id})
            .getOne();
        if(todo !== undefined){
            return todo;
        }
        return undefined;
    }
    async create(data: PostCreateTodoDto, user: number): Promise<TodoEntity> {
        const todo = plainToClass(TodoEntity, {
            user,
            content: data.content,
        });
        if(data.scheduled !== undefined){
            todo.scheduled = +data.scheduled;
        }
        return this.todoRepository.save(todo);
    }
    async setCompleted(todoId: number, state: boolean, user: number): Promise<boolean> {
        const todo = await this.findByIdAndUser(todoId, user);
        if(todo !== undefined){
            todo.completed = state;
            try {
                await this.todoRepository.save(todo);
                return true;
            }catch(e){
                this.logger.error(e.message, e.stack);
            }
        }
        return false;
    }
}
