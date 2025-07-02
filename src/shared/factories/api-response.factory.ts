import { ApiResponse } from "../types/api-response.types";
import { EHTTP_CODES } from "../types/http-codes.enum";

export class ApiResponseFactory {
	constructor() {}

	static createResponse<TData = object, TMeta = object>({
		data = {} as TData,
		status = EHTTP_CODES.OK,
		meta = {} as TMeta,
	}: {
		data?: TData;
		status?: EHTTP_CODES;
		meta?: TMeta;
	}): ApiResponse<TData, TMeta> {
		return {
			data,
			status,
			meta,
		};
	}
}