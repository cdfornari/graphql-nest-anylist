import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RolesArgs } from './dto/args/roles.args';
import { JwtGraphQLAuthGuard } from '../auth/guards/jwt-graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from './enums/role.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';

@Resolver(() => User)
@UseGuards(JwtGraphQLAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() arg: RolesArgs,
    @CurrentUser([Role.admin]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(arg.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([Role.admin]) user: User,
  ): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([Role.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([Role.admin]) user: User,
  ) {
    return this.usersService.update(updateUserInput, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @Parent() user: User,
    @CurrentUser() admin: User,
  ): Promise<number> {
    return this.itemsService.count(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser() admin: User,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, { name: 'listCount' })
  async listCount(
    @Parent() user: User,
    @CurrentUser() admin: User,
  ): Promise<number> {
    return this.listsService.count(user);
  }

  @ResolveField(() => [List], { name: 'lists' })
  async getListByUser(
    @Parent() user: User,
    @CurrentUser() admin: User,
  ): Promise<List[]> {
    return this.listsService.findAll(user);
  }
}
