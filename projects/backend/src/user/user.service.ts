import { Inject, Injectable, NotFoundException } from '@nestjs/common'; // <-- Add NotFoundException
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../../db/drizzle.provider';
import * as schema from '../../db/schema';
import { UpdateUserDto } from './user.dto'; // <-- Import the DTO

@Injectable()
export class UserService{
  constructor(
    @Inject(DRIZZLE_PROVIDER) private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll(){
    return this.db.query.users.findMany();
  }

  async update(id : number , updateuserdto : UpdateUserDto){
    const[updateuser] = await this.db
    .update(schema.users)
    .set(updateuserdto)
    .where(eq(schema.users.uid, id))
    .returning();
  if(!updateuser){
    throw new NotFoundException(`User with ID ${id} not found.`);
  }
  return updateuser;
  }
}