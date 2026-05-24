import { Test, TestingModule } from '@nestjs/testing';
import { AddBillHandler } from './add-bill.handler';
import { PrismaService } from '@/prisma/prisma.service';
import { DebtsService } from '@/debts/debts.service';
import { BillService } from '@/bills/bill.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('AddBillHandler', () => {
  let handler: AddBillHandler;
  let prisma: PrismaService;
  let debtsService: DebtsService;
  let billService: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddBillHandler,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(async (cb) => {
              const mockTx = {
                bill: { create: jest.fn().mockResolvedValue({ id: 'bill-1' }) },
              };
              return cb(mockTx);
            }),
          },
        },
        {
          provide: DebtsService,
          useValue: {
            AddDebt: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: BillService,
          useValue: {
            createDebtDtoFromBill: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    handler = module.get(AddBillHandler);
    prisma = module.get(PrismaService);
    debtsService = module.get(DebtsService);
    billService = module.get(BillService);
  });

  it('should create a bill and update debts', async () => {
    const command = {
      billInfo: {
        creditorId: '1',
        debtorIDs: ['2'],
        description: 'Test bill',
        totalAmount: 100000,
        billType: 'split',
      },
    };

    await expect(handler.execute(command as any)).resolves.not.toThrow();
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException on transaction failure', async () => {
    jest.spyOn(prisma, '$transaction').mockRejectedValue(new Error('DB error'));

    const command = {
      billInfo: {
        creditorId: '1',
        debtorIDs: ['2'],
        description: 'Test bill',
        totalAmount: 100000,
        billType: 'split',
      },
    };

    await expect(handler.execute(command as any)).rejects.toThrow(InternalServerErrorException);
  });
});
