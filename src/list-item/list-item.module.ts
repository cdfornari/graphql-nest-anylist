import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';
import { ListItem } from './entities/list-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListItem])],
  providers: [ListItemResolver, ListItemService],
  exports: [ListItemService],
})
export class ListItemModule {}
