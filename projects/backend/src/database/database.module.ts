// database.module.ts
import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { poolConfig } from '@backend/src/configurations/configs';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({
  providers: [
    {
      provide: Pool,
      useFactory: () => new Pool(poolConfig),
    },
    DrizzleService,
  ],
  exports: [Pool, DrizzleService],
})
export class DatabaseModule {}
