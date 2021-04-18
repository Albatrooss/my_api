import { Field, Int, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Quote extends BaseEntity {
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
    email!: string;

    @Field()
    @Column()
    phoneNumber!: string;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column({ default: 0 })
    status!: number;
}
