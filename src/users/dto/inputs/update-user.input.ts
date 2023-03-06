import { PartialType, Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsIn, IsOptional, IsUUID } from 'class-validator';
import { SignUpInput } from 'src/auth/dto/inputs';
import { Role } from 'src/users/enums/role.enum';

@InputType()
export class UpdateUserInput extends PartialType(SignUpInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [Role], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsIn([Role.admin, Role.user], { each: true })
  roles?: Role[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
