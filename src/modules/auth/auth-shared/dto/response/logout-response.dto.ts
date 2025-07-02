import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
	@ApiProperty({
		description: 'Logout message',
		example: 'Logout successfully'
	})
	public message: string

	constructor(message: string) {
		this.message = message
	}
} 