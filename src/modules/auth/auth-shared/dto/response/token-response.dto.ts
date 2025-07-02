import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
	@ApiProperty({
		description: 'access token',
		example: '...accessToken...'
	})
	public accessToken: string

	constructor(accessToken: string) {
		this.accessToken = accessToken
	}
} 