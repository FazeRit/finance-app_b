import { ApiProperty } from '@nestjs/swagger';
import { Expense } from '@prisma/client';

export class ExpenseEntity implements Expense {
  @ApiProperty({
    description: 'Unique identifier of the expense',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  })
  id: string;

  @ApiProperty({
    description: 'Amount of the expense',
    example: 25.99,
  })
  amount: number;

  @ApiProperty({
    description: 'Description of the expense',
    example: 'Lunch at restaurant',
  })
  description: string;

  @ApiProperty({
    description: 'Date when the expense occurred',
    example: '2024-03-15T12:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'ID of the user who created the expense',
    example: 'clx1a2b3c4d5e6f7g8h9i0j2',
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the category this expense belongs to',
    example: 'clx1a2b3c4d5e6f7g8h9i0j3',
    nullable: true,
  })
  categoryId: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-03-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  updatedAt: Date;
}