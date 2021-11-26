import { MyContext } from '../util/types';
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql';
import { FieldError } from './QuoteResolver';
import bcrypt from 'bcrypt';
import { Xmas } from '../entities/Xmas';
import { COOKIE_NAME, MEMBERS } from '../util/constants';
import { getConnection } from 'typeorm';
import { AuthMd } from '../util/AuthMd';
import { randomize } from '../util/randomize';

@ObjectType()
class XmasResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Xmas, { nullable: true })
    user?: Xmas;
}

@Resolver(() => Xmas)
export class XmasResolver {
    
    @UseMiddleware(AuthMd('XMAS'))
    @Query(() => Xmas, { nullable: true })
    meXmas(@Ctx() { req }: MyContext): Promise<Xmas | undefined> {
        const userId = req.session.xmasId;
        if (!userId) return new Promise(res => res(undefined));
        return Xmas.findOne(userId);
    }

    @UseMiddleware(AuthMd('XMAS'))
    @Mutation(() => XmasResponse)
    async createXmas(@Arg('name') name: string, @Arg('password') password: string): Promise<XmasResponse> {
      name = name.toLowerCase();
      if (!Object.keys(MEMBERS).includes(name)) return {
        errors: [{
          field: 'name',
          message: 'Must be a Robillard+'
        }]
      }
      const hashedPassword = await bcrypt.hash(password, 6);
      let user;
      try {
        const result = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Xmas)
          .values({
            name,
            password: hashedPassword
          })
          .returning('*')
          .execute();
        user = result.raw[0];
      } catch (error) {
        if (error.detail.includes('already exists')) {
          return {
            errors: [
              {
                field: 'name',
                message: 'Name taken',
              },
            ],
          };
        }
        return {
          errors: [
              {
                  field: 'name',
                  message: error.message,
              },
          ],
        };
      }
      return {
          user,
      };
    }

    @UseMiddleware(AuthMd('XMAS'))
    @Mutation(() => XmasResponse)
    async loginXmas(
        @Arg('name') name: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext,
    ): Promise<XmasResponse> {
        const xmas = await Xmas.findOne({ where: { name } });
        if (!xmas) {
            return {
                errors: [
                    {
                        field: 'name',
                        message: 'Robillards+ Only',
                    },
                ],
            };
        }
        const valid = await bcrypt.compare(password, xmas.password);
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
        console.log(xmas)
        req.session.xmasId = xmas.id;
        console.log('saved')
        return {
            user: xmas,
        };
    }

    @Mutation(() => Boolean)
    logoutXmas(@Ctx() { req, res }: MyContext) {
      return new Promise((resolve) =>
        req.session.destroy((err) => {
          res.clearCookie(COOKIE_NAME);
          if (err) {
            console.log(err);
            resolve(false);
            return;
          }

          resolve(true);
        })
      );
    }

    @UseMiddleware(AuthMd('XMAS'))
    @Mutation(() => Boolean)
    async randomize() {
      const res = await Xmas.find();
      const random = Object.entries(randomize()).map(([name, gift]) => ({
        name,
        giftId: res.find(x => x.name === gift)!.id,
      }))
      await Promise.all(random.map(({name, giftId}) => Xmas.update({name}, {giftId})))
      return true;
    }

    @FieldResolver()
    gift(@Root() { giftId }: Xmas) {
      return Xmas.findOne({where: {id: giftId}})
    }
}
