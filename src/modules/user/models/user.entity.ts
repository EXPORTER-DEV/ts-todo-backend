import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TodoEntity } from "../../todo/models/todo.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 64})
    firstname: string;

    @Column({type: 'varchar', length: 64})
    lastname: string;

    @Column({type: 'varchar', unique: true, length: 128})
    email: string;

    @Column({type: 'text'})
    password: string;

    @Column({type: 'text', nullable: true})
    refresh_hash: string;

    @OneToMany(() => TodoEntity, (todoEntity) => todoEntity.user)
    todos: TodoEntity[];

    @Column({type: 'double'})
    created_at: number;

    @BeforeInsert()
    createdAt(){
        this.created_at = Date.now();
    }
}