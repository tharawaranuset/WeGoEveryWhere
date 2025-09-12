// database.module.ts
import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { poolConfig } from '@backend/src/configurations/configs';

@Global()
@Module({
  providers: [
    {
      provide: Pool,
      useFactory: () => new Pool(poolConfig),
    },
  ],
  exports: [Pool],
})
export class DatabaseModule {}
