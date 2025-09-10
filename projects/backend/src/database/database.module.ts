import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema'; // <-- ตรวจสอบ path ให้ถูกต้อง
import { poolConfig } from '@backend/src/configurations/configs'; // <-- ตรวจสอบ path

// Token สำหรับ Inject Drizzle
export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

@Global()
@Module({
  providers: [
    // 1. สร้าง Pool (วัตถุดิบ)
    {
      provide: Pool,
      useFactory: () => new Pool(poolConfig),
    },
    // 2. สร้าง Drizzle (ผลิตภัณฑ์) โดยใช้ Pool จากด้านบน
    {
      provide: DRIZZLE_PROVIDER,
      inject: [Pool],
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
    },
  ],
  // 3. ส่งออกให้คนอื่นใช้ได้ทั้ง 2 อย่าง
  exports: [Pool, DRIZZLE_PROVIDER],
})
export class DatabaseModule {}