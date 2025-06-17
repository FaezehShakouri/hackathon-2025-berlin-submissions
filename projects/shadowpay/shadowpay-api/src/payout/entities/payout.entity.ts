import { Entity, Column, Generated } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity({ name: 'payout_requests2' })
export class PayoutRequest extends BaseEntity {
  constructor(partial: Partial<PayoutRequest>) {
    super();
    Object.assign(this, partial);
  }

  @Generated('increment')
  @Column()
  jobId: number;

  @Column({ type: 'json', nullable: false, default: [] })
  recipients: any;
}
