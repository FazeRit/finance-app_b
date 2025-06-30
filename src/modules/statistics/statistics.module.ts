import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { ExpenseModule } from 'src/modules/expenses/expense.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ExpenseModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 3,
        },
      ],
      errorMessage: 'Rate limit exceeded. Please try again after 60 seconds.',
    }),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
