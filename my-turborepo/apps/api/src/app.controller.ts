import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { DebtsService } from './debts/debts.service';
import { Bill } from './decorators/bill.decorator';
import { BillDto } from './dtos/bill.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddBillCommand } from './bills/commands/addBill/add-bill.command';
import { BillService } from './bills/bill.service';
import { type Request } from 'express';
import { QueryDto } from './dtos/QueryDto';
import { BillQueryHandler } from './bills/queries/billQuery/bill-query.handler';
import { BillQuery } from './bills/queries/billQuery/bill-query.query';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('API')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly debt: DebtsService,
    private readonly bill: BillService,
    private readonly commmandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  async getHello(): Promise<string> {
    return 'hello';
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed initial data' })
  @ApiResponse({ status: 201, description: 'Data seeded successfully' })
  async seedData() {
    this.debt.seed();
  }

  @Post('/bills/add')
  @ApiOperation({ summary: 'Add a new bill' })
  @ApiBody({ type: BillDto })
  @ApiResponse({ status: 201, description: 'Bill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addBill(@Bill() bill: BillDto) {
    console.log(bill);
    return this.bill.addBill(bill);
  }

  @Post('/bills/edit')
  @ApiOperation({ summary: 'Edit an existing bill' })
  @ApiBody({ type: BillDto })
  @ApiResponse({ status: 200, description: 'Bill updated successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  async editBill(@Bill() bill: BillDto) {
    console.log(bill);
    return this.bill.editBill(bill);
  }

  @Post('/bills/remove')
  @ApiOperation({ summary: 'Remove a bill' })
  @ApiBody({
    schema: { type: 'object', properties: { billId: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, description: 'Bill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  async removeBill(@Req() req: Request) {
    console.log(req.body.billId);
    return this.bill.deleteBill(req.body.billId);
  }

  @Get('/bills/query')
  @ApiOperation({ summary: 'Query bills with filters' })
  @ApiQuery({
    name: 'creditorId',
    required: false,
    description: 'Filter by creditor ID',
  })
  @ApiQuery({
    name: 'lowerAmount',
    required: false,
    description: 'Minimum total amount',
  })
  @ApiQuery({
    name: 'upperAmount',
    required: false,
    description: 'Maximum total amount',
  })
  @ApiQuery({
    name: 'timeDesc',
    required: false,
    description: 'Sort by creation time descending',
  })
  @ApiResponse({ status: 200, description: 'Returns filtered bills' })
  async queryBills(
    @Query('creditorId') creditorId: string | null,
    @Query('lowerAmount') lowerAmount: number | null,
    @Query('upperAmount') upperAmount: number | null,
    @Query('timeDesc') timeDesc: boolean | null,
  ) {
    const query: QueryDto = {
      creditorId: creditorId,
      lowerAmount: lowerAmount,
      upperAmount: upperAmount,
      timeDesc: timeDesc,
    };

    return this.queryBus.execute(new BillQuery(query));
  }
}
