import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './models/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TodoEntity
    ])
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
