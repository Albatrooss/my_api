import { Field, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Wish extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @CreateDateColumn()
    updatedAt: Date;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    text: string;

    @Field()
    @Column()
    like: boolean;
}
