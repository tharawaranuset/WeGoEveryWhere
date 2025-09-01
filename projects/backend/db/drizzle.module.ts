// backend/src/db/drizzle.module.ts
import { Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.provider';

@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider], // We export it so any module that imports this one can use it
})
export class DrizzleModule {}