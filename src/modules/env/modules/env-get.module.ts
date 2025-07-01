import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvGetService } from "../service/env-get.service";

@Module({
	imports: [ConfigModule,],
	providers: [EnvGetService],
	exports: [EnvGetService]
})
export class EnvGetModule {}