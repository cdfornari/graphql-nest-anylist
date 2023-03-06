import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';

@Entity('listItems')
@Unique(['list', 'item'])
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'numeric', default: 0})
  @Field(() => Float)
  quantity: number;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, (list) => list.listItems, { lazy: true })
  @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItems, { lazy: true })
  @Field(() => Item)
  item: Item;
}
