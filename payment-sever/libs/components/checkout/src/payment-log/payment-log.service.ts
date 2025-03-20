import { Logger, LoggerService } from '@app/logger';
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentLog } from './payment-log.entity';

@Injectable()
export class PaymentLogService {
  private logger: Logger;

  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(PaymentLog)
    private readonly paymentLogRepository: Repository<PaymentLog>,
  ) {
    this.logger = this.loggerService.getLogger(PaymentLogService.name);
  }

  public async create(paymentLog: PaymentLog): Promise<PaymentLog> {
    return this.paymentLogRepository.save(paymentLog);
  }

  public async update(paymentLog: PaymentLog, data: Partial<PaymentLog>): Promise<PaymentLog> {
    return this.paymentLogRepository.save({
      ...paymentLog,
      ...data,
    });
  }
}
