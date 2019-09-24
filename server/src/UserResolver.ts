import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { hash } from 'bcryptjs';
import { User } from './entity/User';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi'
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
  ) {
    try {
      const hashedPwd = await hash(password, 12);
      await User.insert({
        email,
        password: hashedPwd
      })
    } catch {
      console.log('not saved');
      return false;
    }
    return true;
  }
}