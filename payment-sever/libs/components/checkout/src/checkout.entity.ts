import { Column, CreateDateColumn, DeepPartial, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { PaymentLog } from './payment-log/payment-log.entity';
import { PaymentStatus } from './enums/payment-status.enum';
import { SpecificPaymentInputs } from './dtos/combined_payment.input';

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @OneToMany(() => PaymentLog, payment => payment.checkout, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  paymentLog: PaymentLog[];

  @Column('varchar', { length: 60, name: 'external_id', default: null })
  externalId?: string;

  @Column('varchar', { length: 12, name: 'currency' })
  currency: string;

  @Column('int8', {
    name: 'amount',
    default: 0,
    nullable: true,
  })
  amount: number;

  @Column({ type: 'enum', name: 'payment_status', enum: PaymentStatus })
  status: PaymentStatus;

  @Column('jsonb', { name: 'payment_request', nullable: true })
  input?: SpecificPaymentInputs;

  @CreateDateColumn({ type: 'timestamptz', name: 'create_dtm' })
  createdDate?: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'modify_dtm' })
  modifiedDate?: Date;

  constructor(entity: DeepPartial<Checkout>) {
    Object.assign(this, entity);
  }
}
