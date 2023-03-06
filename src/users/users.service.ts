import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto/inputs/sign-up.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './enums/role.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: SignUpInput): Promise<User> {
    if (
      await this.usersRepository.findOneBy({
        email: createUserInput.email,
      })
    )
      throw new BadRequestException('Email already in use');
    try {
      const user = this.usersRepository.create(createUserInput);
      return this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async findAll(roles: Role[] = []): Promise<User[]> {
    if (roles.length === 0) return this.usersRepository.find();
    return this.usersRepository
      .createQueryBuilder()
      .where('ARRAY[roles] @> ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  findOne(
    filter?: Omit<Partial<User>, 'password' | 'roles' | 'items'>,
  ): Promise<User> {
    return this.usersRepository.findOneBy({
      ...(filter.id && { id: filter.id }),
      ...(filter.fullName && { fullName: filter.fullName }),
      ...(filter.email && { email: filter.email }),
      ...(filter.active && { active: filter.active }),
    });
  }

  async update(updateUserInput: UpdateUserInput, admin: User) {
    const user = await this.usersRepository.preload(updateUserInput);
    if (!user) throw new BadRequestException('User not found');
    return this.usersRepository.save({
      ...user,
      lastUpdatedBy: admin,
    });
  }

  async block(id: string, admin: User): Promise<User> {
    const user = await this.findOne({ id });
    if (!user) throw new BadRequestException('User not found');
    user.active = false;
    user.lastUpdatedBy = admin;
    return await this.usersRepository.save(user);
  }

  async removeAll() {
    await this.usersRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }
}
