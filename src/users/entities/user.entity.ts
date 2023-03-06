import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    enum: ['admin', 'user'],
    array: true,
    default: ['user'],
  })
  @Field(() => [Role])
  roles: Role[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  active: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdatedBy' })
  @Field(() => User, { nullable: true })
  lastUpdatedBy?: User;

  @OneToMany(() => Item, (item) => item.user)
  //@Field(() => [Item])
  items: Item[];

  @OneToMany(() => List, (list) => list.user)
  //@Field(() => [List])
  lists: List[];
}
