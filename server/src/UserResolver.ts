import { Resolver, Query, Mutation, Arg, ObjectType, Field } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from './entity/User';
import { sign } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: email });

    if (!user) {
      throw new Error('User is not valid');
    }
    const valid = await compare(user.password, password);

    if (!valid) {
      throw new Error('bad password')
    }
    return {
      accessToken: sign({ userId: user.id }, 'asdfghghgls', { expiresIn: '15m' })
    };
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