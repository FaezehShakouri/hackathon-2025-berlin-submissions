import { Controller, Post, Body } from '@nestjs/common';
import { PayoutRequest } from './entities/payout.entity';
import { PayoutService } from './payout.service';

@Controller('payout')
export class PayoutController {
    constructor(private readonly payoutService: PayoutService) {}

    @Post()
    async createPayoutRequest(@Body() payoutRequest: any) {
        const jobId = await this.payoutService.createPayoutRequest(payoutRequest);
        return {
            jobId: jobId,
        }
    }
}
