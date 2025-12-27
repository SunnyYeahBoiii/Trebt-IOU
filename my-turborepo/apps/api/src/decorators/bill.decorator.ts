import { BillDto } from '@/dtos/bill.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Bill = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const bill: BillDto = {
      id: request.body?.id ?? undefined,
      creditorId: request.body?.creditorId,
      debtorIDs: request.body?.debtorIDs,
      totalAmount: request.body?.totalAmount,
      description: request.body?.description,
      billType: request.body?.billType,
    };
    return bill;
  },
);
