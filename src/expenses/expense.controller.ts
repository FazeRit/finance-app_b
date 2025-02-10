import {
  Controller,
  Get,
  UseGuards,
  ParseIntPipe,
  Post,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CurrentUser } from 'src/utils/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateExpenseDto, CreateExpenseDto } from './dto';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @UseGuards(AuthGuard('jwt-access'))
  @Get()
  async getExpenses(@CurrentUser('id', ParseIntPipe) userId: number) {
    return await this.expenseService.getExpenses(userId);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post()
  async createExpense(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return await this.expenseService.createExpense(userId, createExpenseDto);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get(':id')
  async getExpenseById(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return await this.expenseService.getExpenseById(userId, expenseId);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Delete(':id')
  async deleteExpenseById(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return await this.expenseService.deleteExpenseById(userId, expenseId);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Put(':id')
  async editExpenseById(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    return await this.expenseService.editExpenseById(userId, expenseId, dto);
  }
}
