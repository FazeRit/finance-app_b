import { ApiResponseFactory } from "./api-response.factory";
import { EHTTP_CODES } from "../types/http-codes.enum";

export class ApiException {
	constructor() {}

	static notFound(message: string)  {
		return ApiResponseFactory.createResponse({
			status: EHTTP_CODES.NOT_FOUND,
			data: message,
		})
	}

	static unauthorized(message: string,) {
		return ApiResponseFactory.createResponse({
			status: EHTTP_CODES.UNAUTHORIZED,
			data: message,
		})
	}

	static internal(message: string,) {
		return ApiResponseFactory.createResponse({
			status: EHTTP_CODES.INTERNAL_SERVER_ERROR,
			data: message,
		})
	}

	static conflict(message: string,) {
		return ApiResponseFactory.createResponse({
			status: EHTTP_CODES.CONFLICT,
			data: message,
		})
	}
}