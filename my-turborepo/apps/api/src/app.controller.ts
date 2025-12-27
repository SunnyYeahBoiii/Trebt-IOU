import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DebtsService } from './debts/debts.service';
import { Bill } from './decorators/bill.decorator';
import { BillDto } from './dtos/bill.dto';
import { BillService } from './bills/bill.service';
import { QueryDto } from './dtos/QueryDto';
import { BillQuery } from './bills/queries/billQuery/bill-query.query';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';

@ApiTags('API')
@Controller()
export class AppController {
  constructor(
    private readonly debt: DebtsService,
    private readonly bill: BillService,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  getHello(): string {
    return 'hello';
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed initial data' })
  @ApiResponse({ status: 201, description: 'Data seeded successfully' })
  async seedData() {
    await this.debt.seed();
  }

  @Post('/bills/add')
  @ApiOperation({ summary: 'Add a new bill' })
  @ApiBody({ type: BillDto })
  @ApiResponse({ status: 201, description: 'Bill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addBill(@Bill() bill: BillDto) {
    console.log(bill);
    return await this.bill.addBill(bill);
  }

  @Post('/bills/edit')
  @ApiOperation({ summary: 'Edit an existing bill' })
  @ApiBody({ type: BillDto })
  @ApiResponse({ status: 200, description: 'Bill updated successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  async editBill(@Bill() bill: BillDto) {
    console.log(bill);
    return await this.bill.editBill(bill);
  }

  @Post('/bills/remove')
  @ApiOperation({ summary: 'Remove a bill' })
  @ApiBody({
    schema: { type: 'object', properties: { billId: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, description: 'Bill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  async removeBill(@Body('billId') billId: string) {
    return await this.bill.deleteBill(billId);
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

    return await this.queryBus.execute(new BillQuery(query));
  }
}
