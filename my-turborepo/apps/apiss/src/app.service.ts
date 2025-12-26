import { Injectable } from '@nestjs/common';
import { DebtsService } from './debts/debts.service';

@Injectable()
export class AppService {
  constructor(private readonly debt: DebtsService) {}

  getHello() {
    // await this.debt.seed();
    return 'Toi bi ngu';
  }
}
