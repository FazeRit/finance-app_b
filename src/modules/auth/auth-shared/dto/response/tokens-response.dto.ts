import { ApiProperty } from "@nestjs/swagger"

export class TokensResponseDto {
	@ApiProperty({
		description: 'access token',
		example: '...accessToken...'
	})
	public accessToken: string

	@ApiProperty({
	  description: 'refresh token one',
	  example: '...refreshToken...'
	})
	public refreshToken: string

	constructor(accessToken: string, refreshToken: string) {
		this.accessToken = accessToken
		this.refreshToken = refreshToken
	}
}