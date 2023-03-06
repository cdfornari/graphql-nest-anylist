import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { SearchArgs } from 'src/common/dto/args/search.args';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this.listRepository.create({
      ...createListInput,
      user,
    });
    return this.listRepository.save(list);
  }

  findAll(
    user?: User,
    pagination?: PaginationArgs,
    searchArgs?: SearchArgs,
  ): Promise<List[]> {
    const { limit, skip } = pagination || {};
    const { search } = searchArgs || {};
    const query = this.listRepository
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

  async findOne(id: string, user?: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      ...(user && { user: { id: user.id } }),
    });
    if (!list) throw new NotFoundException(`List with id ${id} not found`);
    return list;
  }

  async count(user?: User): Promise<number> {
    return this.listRepository.count({
      where: { ...(user && { user: { id: user.id } }) },
    });
  }

  async update(updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(updateListInput.id, user);
    const list = await this.listRepository.preload(updateListInput);
    return this.listRepository.save(list);
  }

  async remove(id: string, user?: User): Promise<List> {
    const list = await this.findOne(id, user);
    return this.listRepository.remove(list);
  }

  async removeAll() {
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
  }
}
