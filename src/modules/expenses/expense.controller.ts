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
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CurrentUser } from 'src/shared/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateExpenseDto, CreateExpenseDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

class DeleteExpenseResponse {
  @ApiProperty({
    description: 'Message after successful deleting',
    example: 'Expense deleted successfully',
  })
  message: string;
}

@ApiTags('expenses')
@UseGuards(AuthGuard('jwt-access'))
@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @ApiOperation({ summary: 'Get all expenses for the authenticated user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @Get()
  async getExpenses(
    @CurrentUser('id') userId: string,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return await this.expenseService.getExpenses(
      userId,
      take,
      page,
      limit,
      sort === 'asc' || sort === 'desc' ? sort : undefined,
    );
  }

  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or category not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @ApiBody({
    type: CreateExpenseDto,
    description: 'Expense creation data',
  })
  @Post()
  async createExpense(
    @CurrentUser('id') userId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return await this.expenseService.createExpense(userId, createExpenseDto);
  }

  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to fetch',
    example: 1,
    type: Number,
    required: true,
  })
  @Get(':id')
  async getExpenseById(
    @CurrentUser('id') userId: string,
    @Param('id') expenseId: string,
  ) {
    return await this.expenseService.getExpenseById(userId, expenseId);
  }

  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense deleted successfully',
    type: DeleteExpenseResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to delete',
    example: 1,
    type: Number,
    required: true,
  })
  @Delete(':id')
  async deleteExpenseById(
    @CurrentUser('id') userId: string,
    @Param('id') expenseId: string,
  ) {
    return await this.expenseService.deleteExpenseById(userId, expenseId);
  }

  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @ApiParam({
    name: 'id',
    description: 'The ID of the expense to update',
    example: 1,
    type: Number,
    required: true,
  })
  @ApiBody({
    type: UpdateExpenseDto,
    description: 'Expense update data',
  })
  @Put(':id')
  async editExpenseById(
    @CurrentUser('id',) userId: string,
    @Param('id',) expenseId: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return await this.expenseService.editExpenseById(userId, expenseId, dto);
  }
}
