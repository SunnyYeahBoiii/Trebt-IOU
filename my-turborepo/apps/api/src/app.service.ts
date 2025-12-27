import { Get, Injectable, Post, Req } from '@nestjs/common';
import { DebtsService } from './debts/debts.service';
import { type Request } from 'express';
import { BillDto } from './dtos/bill.dto';
import { Bill } from './decorators/bill.decorator';

@Injectable()
export class AppService {
    constructor(private readonly debt: DebtsService) {}   
}

