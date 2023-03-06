import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  @IsInt()
  @IsOptional()
  skip: number = 0;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @IsInt()
  limit: number = 10;
}