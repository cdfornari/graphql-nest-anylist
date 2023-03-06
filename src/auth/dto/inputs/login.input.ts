import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Minimum 6 characters' })
  @IsString()
  @MinLength(6)
  password: string;
}
