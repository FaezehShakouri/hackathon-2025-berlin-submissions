import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawRequestDto } from './dto/withdraw-request.dto';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async withdraw(@Body() withdrawRequestDto: WithdrawRequestDto) {
    const { recipient, amount } = withdrawRequestDto;
    const txHash = await this.withdrawService.withdraw(recipient, amount);
    return { success: true, txHash };
  }
} 