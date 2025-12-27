import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { DebtsService } from './debts/debts.service';
import { Bill } from './decorators/bill.decorator';
import { BillDto } from './dtos/bill.dto';
import { CommandBus } from '@nestjs/cqrs';
import { AddBillCommand } from './bills/commands/addBill/add-bill.command';
import { BillService } from './bills/bill.service';
import { type Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly debt: DebtsService,
    private readonly bill: BillService,
    private readonly commmandBus: CommandBus,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'hello';
  }

  @Post('seed')
  async seedData(){
    this.debt.seed();
  }

  @Post('/bills/add')
  async addBill(@Bill() bill: BillDto){
    console.log(bill);
    return this.bill.addBill(bill);
  }

  @Post('/bills/edit')
  async editBill(@Bill() bill: BillDto){
    console.log(bill)
    return this.bill.editBill(bill);
  }

  @Post('/bills/remove')
  async removeBill(@Req() req: Request){
    console.log(req.body.billId)
    return this.bill.deleteBill(req.body.billId)
  }
}
