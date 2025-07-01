import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticsFacadeService } from './services/statistics-facade-service/statistics-facade.service';
import { StatisticsReadController } from './controllers/statistics-read-controller/statistics-read.controller';
import { StatisticsReadService } from './services/statistics-read-service/statistics-read.service';

@Module({
  imports: [PrismaModule],
  controllers: [StatisticsReadController],
  providers: [
    StatisticsFacadeService,
    StatisticsReadService,
  ],
})
export class StatisticsModule {}
