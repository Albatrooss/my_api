import { Wish } from '../entities/Wish';
import {
    Arg,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
} from 'type-graphql';
import { FieldError } from './QuoteResolver';

@ObjectType()
@InputType()
export class WishInput {
    @Field()
    name: string;
    @Field()
    text: string;
    @Field()
    like: boolean;
}

@ObjectType()
class WishResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Wish, { nullable: true })
    wish?: Wish;
}

@Resolver(Wish)
export class WishResolver {
    @Query(() => [Wish])
    wishes(): Promise<Wish[]> {
        return Wish.find({ order: { id: 'DESC' } });
    }

    @Mutation(() => WishResponse)
    async createWish(@Arg('input') input: WishInput): Promise<WishResponse> {
        if (!input.name) {
            return {
                errors: [
                    {
                        field: 'name',
                        message: 'Name required',
                    },
                ],
            };
        }

        const tempWish = Wish.create({ ...input });
        const wish = await tempWish.save();
        return {
            wish
        }
    }

    // @Mutation(() => Boolean)
    // async updateQuoteStatus(
    //     @Arg('status', () => Int) status: number,
    //     @Arg('id', () => Int) id: number,
    // ): Promise<boolean> {
    //     if (status > 4) false;
    //     const updatedQuote = await Quote.update({ id }, { status });
    //     if (updatedQuote.affected !== 1) return false;
    //     return true;
    // }

    // @Mutation(() => Boolean)
    // async deleteQuote(@Arg('id', () => Int) id: number) {
    //     await Quote.delete({ id });
    //     return true;
    // }
}
