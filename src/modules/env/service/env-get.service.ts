import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EENV_CONFIG } from "../enums/env-config.enum";

@Injectable()
export class EnvGetService {
	constructor(private readonly config: ConfigService,) {}

	public get(variable: EENV_CONFIG): string {
		return this.config.getOrThrow(variable)
	}
}