import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  admin = 'admin',
  user = 'user',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
  valuesMap: {
    admin: { description: 'Admin privileges' },
    user: { description: 'Normal privileges' },
  },
});
