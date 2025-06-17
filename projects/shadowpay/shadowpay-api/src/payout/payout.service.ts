import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutRequest } from './entities/payout.entity';

@Injectable()
export class PayoutService {
    constructor(
        @InjectRepository(PayoutRequest)
        private payoutRequestRepository: Repository<PayoutRequest>,
    ) {}

    async createPayoutRequest(payoutRequest: any): Promise<number> {
        const result = await this.payoutRequestRepository.save(payoutRequest);
        console.log(result);
        return result.jobId;
    }
}
