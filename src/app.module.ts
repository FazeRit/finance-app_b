import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ExpenseModule } from './expenses/expense.module';
import { CategoriesModule } from './categories/categories.module';
import { DocumentModule } from './document/document.module';
import { OCRModule } from './ocr/ocr.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ExpenseModule,
    CategoriesModule,
    DocumentModule,
    OCRModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
