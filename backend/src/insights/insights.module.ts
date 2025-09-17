import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { InsightsService } from "./insights.service";
import { InsightsController } from "./insights.controller";
import { PrismaService } from "@/common/prisma/prisma.service";
import { UserService } from "@/user/user.service";
import { OpenAiService } from "@/common/open-ai/open-ai.service";
import { OpenWeatherService } from "@/common/open-weather/open-weather.service";

@Module({
  imports: [
    CacheModule.register({
      ttl: 5 * 60 * 1000,
      max: 1000,
    }),
  ],
  controllers: [InsightsController],
  providers: [
    InsightsService,
    OpenAiService,
    PrismaService,
    UserService,
    OpenWeatherService,
  ],
})
export class InsightsModule {}
