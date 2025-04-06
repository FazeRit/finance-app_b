import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExpenseDto {
  @ApiProperty({
    description: 'The updated amount of the expense',
    example: 75.0,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'The updated description of the expense',
    example: 'Dinner with family',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The updated date of the expense (ISO 8601 format)',
    example: '2023-10-16T18:00:00Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
