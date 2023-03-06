import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}

  async create(
    createListItemInput: CreateListItemInput,
    user?: User,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;
    const listItem = this.listItemRepository.create({
      ...rest,
      list: { id: listId },
      item: { id: itemId },
    });
    await this.listItemRepository.save(listItem);
    return this.findOne(listItem.id);
  }

  findAll(
    pagination?: PaginationArgs,
    searchArgs?: SearchArgs,
    list?: List,
  ): Promise<ListItem[]> {
    const { limit, skip } = pagination || {};
    const { search } = searchArgs || {};
    const query = this.listItemRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(skip);
    if (list) query.andWhere({ list: { id: list.id } });
    if (search)
      query.andWhere('LOWER(item.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    return query.getMany();
  }

  async count(list?: List): Promise<number> {
    return this.listItemRepository.count({
      where: { ...(list && { list: { id: list.id } }) },
    });
  }

  async findOne(id: string, user?: User): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({
      id,
      ...(user && { list: { user: { id: user.id } } }),
    });
    if (!listItem) throw new NotFoundException('ListItem not found');
    return listItem;
  }

  async update(updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { id, listId, itemId, ...rest } = updateListItemInput;
    await this.listItemRepository
      .createQueryBuilder()
      .update()
      .set({
        ...rest,
        ...(listId && { list: { id: listId } }),
        ...(itemId && { item: { id: itemId } }),
      })
      .where('id = :id', { id })
      .execute();
    return this.findOne(id);
  }

  async removeAll() {
    await this.listItemRepository.createQueryBuilder().delete().where({}).execute();
  }

}
