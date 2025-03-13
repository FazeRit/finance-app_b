import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OpenAIRequestDto {
  @ApiProperty({
    description: 'The prompt for the OpenAI chat completion',
    example: 'Please provide a summary of the article.',
    type: String,
  })
  @IsString()
  prompt!: string;
}
