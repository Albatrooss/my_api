import { Quote } from '../entities/Quote';
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
import { sendEmail } from '../util/sendEmail';
import { createEmailData } from '../util/createEmailData';
import { statusStr } from '../util/constants';

@ObjectType()
@InputType()
export class QuoteInput {
    @Field()
    name: string;
    @Field()
    email: string;
    @Field()
    phoneNumber: string;
    @Field()
    description: string;
}

@ObjectType()
export class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class QuoteResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Quote, { nullable: true })
    quote?: Quote;
}

@Resolver(Quote)
export class QuoteResolver {
    @FieldResolver()
    statusStr(@Root() root: Quote): string {
        return statusStr[root.status];
    }

    @Query(() => [Quote])
    quotes(): Promise<Quote[]> {
        return Quote.find({ order: { id: 'DESC' } });
    }

    @Mutation(() => QuoteResponse)
    async createQuote(@Arg('input') input: QuoteInput): Promise<QuoteResponse> {
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

        if (!input.phoneNumber && !input.email) {
            return {
                errors: [
                    {
                        field: 'phoneNumber',
                        message: 'We need a way to reach you!',
                    },
                ],
            };
        }
        const quote = Quote.create({ ...input });
        const emailSent = await sendEmail(createEmailData(input));
        console.log('email ?', emailSent);
        if (emailSent) {
            const newQuote = await quote.save();
            return {
                quote: newQuote,
            };
        }
        return {
            errors: [
                {
                    field: 'email',
                    message:
                        'Quote not saved, please try again. If the issue persists please give us a call at 123-456-7890',
                },
            ],
        };
    }

    @Mutation(() => Boolean)
    async updateQuoteStatus(
        @Arg('status', () => Int) status: number,
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
        if (status > 4) false;
        const updatedQuote = await Quote.update({ id }, { status });
        if (updatedQuote.affected !== 1) return false;
        return true;
    }

    @Mutation(() => Boolean)
    async deleteQuote(@Arg('id', () => Int) id: number) {
        await Quote.delete({ id });
        return true;
    }
}
