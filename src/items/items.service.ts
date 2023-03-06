import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { User } from 'src/users/entities/user.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const item = this.itemRepository.create({
      ...createItemInput,
      user,
    });
    return this.itemRepository.save(item);
  }

  findAll(
    user?: User,
    pagination?: PaginationArgs,
    searchArgs?: SearchArgs,
  ): Promise<Item[]> {
    const { limit, skip } = pagination || {};
    const { search } = searchArgs || {};
    const query = this.itemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(skip);
    if (user) query.andWhere({ user: { id: user.id } });
    if (search)
      query.andWhere('LOWER(name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    return query.getMany();
  }

  async findOne(id: string, user?: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({
      id,
      ...(user && { user: { id: user.id } }),
    });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async count(user?: User): Promise<number> {
    return this.itemRepository.count({
      where: { ...(user && { user: { id: user.id } }) },
    });
  }

  async update(updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(updateItemInput.id, user);
    const item = await this.itemRepository.preload(updateItemInput);
    return this.itemRepository.save(item);
  }

  async remove(id: string, user?: User): Promise<Item> {
    const item = await this.findOne(id, user);
    return this.itemRepository.remove(item);
  }

  async removeAll() {
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
  }
}
