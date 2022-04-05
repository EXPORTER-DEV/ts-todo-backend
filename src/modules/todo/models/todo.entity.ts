import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { UserEntity } from "../../user/models/user.entity";

@Entity()
export class TodoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 512})
    content: string;

    @Column({type: 'double'})
    created_at: number;

    @Column({type: 'double', nullable: true})
    updated_at: number;

    @Column({type: 'boolean', default: false})
    favourite: boolean;

    @Column({type: 'double', nullable: true})
    scheduled: number;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.todos)
    user: UserEntity;

    @RelationId((todoEntity: TodoEntity) => todoEntity.user)
    userId: number;

    @Column({type: 'boolean', default: false})
    completed: boolean;

    @BeforeInsert()
    createdAt(){
        this.created_at = Date.now();
    }

    @BeforeUpdate()
    updatedAt(){
        this.updated_at = Date.now();
    }
}