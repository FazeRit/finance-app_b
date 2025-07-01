import { ExpenseFacadeService } from './services/expense-facade-service/expense-facade.service';
import { ExpenseReadController } from './controllers/expense-read-controller/expense-read.controller';
import { ExpenseReadService } from './services/expense-read-service/expense-read.service';
import { ExpenseWriteController } from './controllers/expense-write-controller/expense-write.controller';
import { ExpenseWriteService } from './services/expense-write-service/expense-write.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    ExpenseReadController,
    ExpenseWriteController,
  ],
  providers: [
    ExpenseFacadeService,
    ExpenseReadService,
    ExpenseWriteService,
  ],
  exports: [
    ExpenseFacadeService,
    ExpenseReadService,
    ExpenseWriteService,
  ],
})
export class ExpenseModule {}
