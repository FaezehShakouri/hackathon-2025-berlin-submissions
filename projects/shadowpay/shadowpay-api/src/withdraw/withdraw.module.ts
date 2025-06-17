import { Module } from '@nestjs/common';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';

@Module({
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {} 