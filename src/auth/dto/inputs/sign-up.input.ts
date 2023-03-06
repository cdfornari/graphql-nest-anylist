import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Minimum 6 characters' })
  @IsString()
  @MinLength(6)
  password: string;
}
