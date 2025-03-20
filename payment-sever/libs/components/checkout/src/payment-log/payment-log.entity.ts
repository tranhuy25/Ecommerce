import { Column, CreateDateColumn, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Checkout } from '../checkout.entity';
import { PaymentType } from '../enums/payment-type.enum';
import { PaymentInput, PaymentResult } from '../payment-processors/payment-processor.interfaces';
import { PaymentLogStatus } from './payment-log-status.enum';

@Entity()
export class PaymentLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Checkout, checkout => checkout.paymentLog, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'checkout_id' })
  checkout: Checkout;

  @Column({ name: 'checkout_id' })
  checkoutId: string;

  @Column('jsonb', { name: 'payment_request' })
  input: PaymentInput;

  @Column('jsonb', { name: 'payment_response', nullable: true })
  result?: PaymentResult;

  @Column('jsonb', { name: 'refund_response', nullable: true })
  refundResult?: string;

  @Column({ type: 'enum', name: 'payment_status', enum: PaymentLogStatus })
  status: PaymentLogStatus;

  @Column({ type: 'enum', name: 'payment_type', enum: PaymentType })
  paymentType: PaymentType;

  @Column('timestamptz', { name: 'payment_end_dtm', nullable: true })
  processedDate?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'create_dtm' })
  createdDate?: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'modify_dtm' })
  modifiedDate?: Date;

  @Column('int8', {
    name: 'amount',
    default: 0,
    nullable: true,
  })
  amount: number;

  constructor(entity: DeepPartial<PaymentLog>) {
    Object.assign(this, entity);
  }
}
