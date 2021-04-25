import { MyContext } from 'src/util/types';
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';
import { User } from '../entities/User';
import { FieldError } from './QuoteResolver';
import bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver(User)
export class UserResolver {
    @Query(() => [User])
    users(): Promise<User[]> {
        return User.find();
    }

    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext): Promise<User | undefined> {
        const userId = req.session.userId;
        if (!userId) return new Promise(res => res(undefined));
        return User.findOne(userId);
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext,
    ): Promise<UserResponse> {
        const hashedPassword = await bcrypt.hash(password, 6);
        let user;
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username,
                    password: hashedPassword,
                })
                .returning('*')
                .execute();
            user = result.raw[0];
        } catch (error) {
            if (error.detail.includes('already exists')) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'Username taken',
                        },
                    ],
                };
            }
            return {
                errors: [
                    {
                        field: 'username',
                        message: error.message,
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext,
    ): Promise<UserResponse> {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Username not found',
                    },
                ],
            };
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Incorrect Password',
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }
}
