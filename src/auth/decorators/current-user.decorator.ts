import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from 'src/users/enums/role.enum';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: Role[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;
    if (!user)
      throw new InternalServerErrorException(
        'No user found in request context, make sure you are using an auth guard',
      );
    if (roles.length === 0) return user;
    if (roles.some((role) => user.roles.includes(role))) return user;
    throw new ForbiddenException('User does not have the required role');
  },
);
