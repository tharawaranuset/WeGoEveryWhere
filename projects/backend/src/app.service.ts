import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../db/drizzle.provider';
import * as schema from '../db/schema';

@Injectable()
export class AppService {
  TestApi(){
    return 'Welcome to the WeGoEverywhere API!';
  }
}