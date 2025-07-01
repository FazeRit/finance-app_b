import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
	Body,
	Controller,
	Delete,
	Param,
	Post,
	Put,
	UseGuards
} from '@nestjs/common';
import { CreateExpenseDoc, DeleteExpenseDoc, UpdateExpenseDoc } from '../../docs';
import { CreateExpenseDto, UpdateExpenseDto } from '../../dto';
import { CurrentUser } from 'src/shared/decorators/get-user.decorator';
import { ExpenseFacadeService } from '../../services/expense-facade-service/expense-facade.service';

@ApiTags('expenses')
@ApiBearerAuth('jwt-access')
@UseGuards(AuthGuard('jwt-access'))
@Controller('expenses')
export class ExpenseWriteController {
  constructor(private readonly facade: ExpenseFacadeService) {}

  @CreateExpenseDoc
  @Post()
  async createExpense(@Body() dto: CreateExpenseDto, @CurrentUser('id') userId: string) {
    return this.facade.createExpense(dto, userId);
  }

  @UpdateExpenseDoc
  @Put(':id')
  async updateExpense(@Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.facade.updateExpense(id, dto);
  }

  @DeleteExpenseDoc
  @Delete(':id')
  async deleteExpense(@Param('id') id: string) {
    return this.facade.deleteExpense(id);
  }
} 