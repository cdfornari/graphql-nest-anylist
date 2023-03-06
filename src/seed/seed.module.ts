import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { AuthModule } from 'src/auth/auth.module';
import { ListItemModule } from '../list-item/list-item.module';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    AuthModule,
    ListItemModule,
    ListsModule,
  ],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
