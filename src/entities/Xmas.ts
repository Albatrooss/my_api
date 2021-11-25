import { Field, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('xmas')
export class Xmas extends BaseEntity {
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
    @Column({ unique: true })
    name!: string;

    @Column()
    password!: string;

    @Field({nullable: true})
    @Column({nullable: true})
    giftId?: number;

    @Field({nullable: true})
    gift?: Xmas;
}
