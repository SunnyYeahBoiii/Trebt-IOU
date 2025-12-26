import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebtsModule } from './debts/debts.module';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [DebtsModule],
  controllers: [AppController],
  providers: [AppService , ConfigService],
})
export class AppModule {}
