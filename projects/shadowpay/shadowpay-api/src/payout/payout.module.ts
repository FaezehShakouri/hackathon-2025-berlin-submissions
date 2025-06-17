import { Module } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayoutRequest } from './entities/payout.entity';
import { PayoutController } from './payout.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PayoutRequest])],
  providers: [PayoutService],
  controllers: [PayoutController]
})
export class PayoutModule {}
