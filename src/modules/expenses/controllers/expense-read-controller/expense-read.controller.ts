import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
	Controller,
	Get,
	Param,
	UseGuards
} from '@nestjs/common';
import { ExpenseFacadeService } from '../../services/expense-facade-service/expense-facade.service';
import { GetExpenseByIdDoc, GetExpensesDoc } from '../../docs';

@ApiTags('expenses')
@ApiBearerAuth('jwt-access')
@UseGuards(AuthGuard('jwt-access'))
@Controller('expenses')
export class ExpenseReadController {
  constructor(private readonly facade: ExpenseFacadeService) {}

  @GetExpensesDoc
  @Get()
  async getExpenses() {
    return this.facade.getExpenses();
  }

  @GetExpenseByIdDoc
  @Get(':id')
  async getExpenseById(@Param('id') id: string) {
    return this.facade.getExpenseById(id);
  }
} 