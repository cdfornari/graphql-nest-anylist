import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptService } from 'src/auth/crypt.service';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { ListItemService } from '../list-item/list-item.service';
import { ListsService } from 'src/lists/lists.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listItemsService: ListItemService,
    private readonly listsService: ListsService,
    private readonly cryptService: CryptService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd)
      throw new UnauthorizedException('Cannot seed in production');
    await this.listItemsService.removeAll();
    await this.listsService.removeAll();
    await this.itemsService.removeAll();
    await this.usersService.removeAll();
    const users: User[] = await Promise.all(
      SEED_USERS.map(
        async (user) =>
          await this.usersService.create({
            ...user,
            password: this.cryptService.hash(user.password),
          }),
      ),
    );
    const items = await Promise.all(
      SEED_ITEMS.map(
        async (item) => await this.itemsService.create(item, users[0]),
      ),
    );
    const lists = await Promise.all(
      SEED_LISTS.map(
        async (list) => await this.listsService.create(list, users[0]),
      ),
    );
    let i: number = 0;
    for await (const list of lists) {
      await this.listItemsService.create(
        {
          listId: list.id,
          itemId: items[i].id,
          quantity: Math.round(Math.random() * 10),
        },
        users[0],
      );
    }
    return true;
  }
}
