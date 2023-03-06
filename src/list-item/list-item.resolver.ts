import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { JwtGraphQLAuthGuard } from '../auth/guards/jwt-graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateListItemInput } from './dto/update-list-item.input';

@Resolver(() => ListItem)
@UseGuards(JwtGraphQLAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser() user: User,
  ) {
    return this.listItemService.create(createListItemInput, user);
  }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.listItemService.findOne(id, user);
  }

  @Mutation(() => ListItem)
  updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput) {
    return this.listItemService.update(updateListItemInput);
  }
}
