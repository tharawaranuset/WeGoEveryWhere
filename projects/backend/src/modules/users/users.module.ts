// users.module.ts
import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserController } from './users.controller';
import { DatabaseModule } from '../../database/database.module';
import { UserService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersRepository,UserService],
  controllers: [UserController],
  exports: [UsersRepository],
})
export class UsersModule {}
