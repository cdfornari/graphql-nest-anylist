import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray, IsOptional } from 'class-validator';
import { Role } from 'src/users/enums/role.enum';

@ArgsType()
export class RolesArgs {
  @Field(() => [Role], { nullable: true })
  @IsOptional()
  @IsArray()
  roles: Role[] = [];
}
