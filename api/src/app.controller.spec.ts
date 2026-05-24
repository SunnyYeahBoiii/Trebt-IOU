import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebtsService } from './debts/debts.service';
import { BillService } from './bills/bill.service';
import { QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './services/token.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: DebtsService, useValue: {} },
        { provide: BillService, useValue: {} },
        { provide: QueryBus, useValue: { execute: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: TokenService, useValue: { generate: jest.fn() } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "hello"', () => {
      expect(appController.getHello()).toBe('hello');
    });
  });
});
