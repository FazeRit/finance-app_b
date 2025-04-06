import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'The amount of the expense',
    example: 50.75,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'The ID of the category for the expense',
    example: 2,
    type: Number,
  })
  @IsOptional()
  @IsString()
  categoryName?: string;

  @ApiProperty({
    description: 'A description of the expense',
    example: 'Lunch with friends',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The date of the expense (ISO 8601 format)',
    example: '2023-10-15T12:00:00Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
