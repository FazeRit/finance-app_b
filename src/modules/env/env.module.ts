import { Global, Module } from "@nestjs/common";
import { EnvGetModule } from "./modules/env-get.module";
import { EnvGetService } from "./service/env-get.service";

@Global()
@Module({
	imports: [EnvGetModule],
	exports: [EnvGetService],
})
export class EnvModule {}