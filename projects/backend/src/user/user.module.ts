import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DrizzleModule } from '../../db/drizzle.module'; // <-- 1. Import DrizzleModule

@Module({
  imports: [DrizzleModule], // <-- 2. Add it to the imports array
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}