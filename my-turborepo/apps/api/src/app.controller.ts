import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DebtsService } from './debts/debts.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly debt: DebtsService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    await this.debt.seed();
    return this.appService.getHello();
  }
}
