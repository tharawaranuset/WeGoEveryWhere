import { Module } from '@nestjs/common';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';

@Module({
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService], // Export for use in auth middleware
})
export class ConsentModule {}