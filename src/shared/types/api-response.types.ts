import { EHTTP_CODES } from "./http-codes.enum";

export class ApiResponse <TData, TMeta = object>{
	public data: TData

	public meta: TMeta

	public status: EHTTP_CODES

	constructor(
		data: TData = {} as TData,
		status: EHTTP_CODES = EHTTP_CODES.OK,
		meta: TMeta = {} as TMeta,
	) {
		this.data = data,
		this.meta = meta,
		this.status = status
	}
}