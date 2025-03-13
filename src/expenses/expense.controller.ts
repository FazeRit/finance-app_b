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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Expense } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

class DeleteExpenseResponse {
  @ApiProperty({
    description: 'Message after successful deleting',
    example: 'Expense deleted successfully',
  })
  message: string;
}

class ExpenseEntity implements Expense {
  @ApiProperty({ description: 'Unique identifier of the expense', example: 1 })
  id: number;

  @ApiProperty({
    description: 'ID of the user who created the expense',
    example: 2,
  })
  userId: number;

  @ApiProperty({ description: 'ID of the expense category', example: 3 })
  categoryId: number;

  @ApiProperty({ description: 'Amount of the expense', example: 99.99 })
  amount: number;

  @ApiProperty({
    description: 'Description of the expense',
    example: 'Lunch with team',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ description: 'Date of the expense', example: '2025-03-12' })
  date: Date;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-03-12T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-03-12T12:00:00Z',
  })
  updatedAt: Date;
}

@ApiTags('expenses')
@UseGuards(AuthGuard('jwt-access'))
@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @ApiOperation({ summary: 'Get all expenses for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Expenses fetched successfully',
    type: [ExpenseEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('jwt-access')
  @Get()
  async getExpenses(@CurrentUser('id', ParseIntPipe) userId: number) {
    return await this.expenseService.getExpenses(userId);
  }

  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'Expense created successfully',
    type: ExpenseEntity,
  })
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
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return await this.expenseService.createExpense(userId, createExpenseDto);
  }

  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense fetched successfully',
    type: ExpenseEntity,
  })
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
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
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
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return await this.expenseService.deleteExpenseById(userId, expenseId);
  }

  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
    type: ExpenseEntity,
  })
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
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    return await this.expenseService.editExpenseById(userId, expenseId, dto);
  }
}
