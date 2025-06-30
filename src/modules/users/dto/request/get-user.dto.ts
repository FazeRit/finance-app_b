import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUserDto {
	@ApiProperty({
		description: 'A id of user',
		example: '12341'
	})
	@IsNotEmpty()
	@IsNumber()
	id?: number;

	@ApiProperty({
		description: 'a email of user',
		example: 'test@example.com'
	})
	@IsEmail()
	@IsNotEmpty()
	@IsString()
	email?: string;
}
