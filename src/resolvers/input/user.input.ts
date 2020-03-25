import { InputType, Field } from '@nestjs/graphql';

@InputType()
class UserInput {
  @Field()
  readonly email: string;
}

export default UserInput;
