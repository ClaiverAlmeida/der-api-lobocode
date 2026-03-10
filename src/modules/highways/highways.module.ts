import { Module } from '@nestjs/common';
import { HighwaysController } from './highways.controller';
import { HighwaysService } from './highways.service';

@Module({
  imports: [],
  controllers: [HighwaysController],
  providers: [HighwaysService],
  exports: [HighwaysService],
})
export class HighwaysModule {}

