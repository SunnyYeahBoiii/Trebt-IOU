import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { DebtsService } from './debts/debts.service';
import { BillDto } from './dtos/bill.dto';
import { RemoveBillDto } from './dtos/remove-bill.dto';
import { QueryDto } from './dtos/QueryDto';
import { BillService } from './bills/bill.service';
import { BillQuery } from './bills/queries/billQuery/bill-query.query';
import { QueryStatisticQuery } from './statistics/queries/queryStatistic/query-statistic.query';
import { Public } from './decorators/public.decorator';
import { TokenService } from './services/token.service';

@ApiTags('API')
@ApiSecurity('api-key')
@Controller()
export class AppController {
  constructor(
    private readonly debt: DebtsService,
    private readonly bill: BillService,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  getHello(): string {
    return 'hello';
  }

  @Get('auth/verify')
  @ApiOperation({ summary: 'Verify API key validity' })
  @ApiResponse({ status: 200, description: 'API key is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  verify() {
    const token = this.tokenService.generate();
    return { verified: true, token };
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed initial data (non-production only)' })
  @ApiResponse({ status: 201, description: 'Data seeded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden in production' })
  async seedData() {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      return { error: 'Seed endpoint is disabled in production' };
    }
    await this.debt.seed();
  }

  @Post('/bills/add')
  @ApiOperation({ summary: 'Add a new bill' })
  @ApiBody({ type: BillDto })
  @ApiResponse({ status: 201, description: 'Bill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addBill(@Body(new ValidationPipe({ whitelist: true })) bill: BillDto) {
    return await this.bill.addBill(bill);
  }

  @Post('/bills/edit')
  @ApiOperation({ summary: 'Edit an existing bill' })
  @ApiBody({ type: BillDto })
  @ApiResponse({ status: 200, description: 'Bill updated successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  async editBill(
    @Body(new ValidationPipe({ whitelist: true })) bill: BillDto,
  ) {
    return await this.bill.editBill(bill);
  }

  @Post('/bills/remove')
  @ApiOperation({ summary: 'Remove a bill' })
  @ApiBody({ type: RemoveBillDto })
  @ApiResponse({ status: 200, description: 'Bill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  async removeBill(
    @Body(new ValidationPipe({ whitelist: true })) body: RemoveBillDto,
  ) {
    return await this.bill.deleteBill(body.billId);
  }

  @Get('/bills/query')
  @ApiOperation({ summary: 'Query bills with filters' })
  @ApiQuery({
    name: 'creditorIds',
    required: false,
    description: 'Filter by creditor IDs (comma-separated)',
  })
  @ApiQuery({
    name: 'debtorIds',
    required: false,
    description: 'Filter by debtor IDs (comma-separated)',
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
    name: 'timeAsc',
    required: false,
    description: 'Sort by creation time ascending',
  })
  @ApiResponse({ status: 200, description: 'Returns filtered bills' })
  async queryBills(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryDto,
  ) {
    return await this.queryBus.execute(new BillQuery(query));
  }

  @Get('/statistic')
  @ApiOperation({ summary: 'Get debt statistics' })
  @ApiResponse({ status: 200, description: 'Returns statistics' })
  async getStatistic() {
    return this.queryBus.execute(new QueryStatisticQuery());
  }
}
