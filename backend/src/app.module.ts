import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { InsightsModule } from "./insights/insights.module";
import { OpenAiService } from "./common/open-ai/open-ai.service";
import { OpenWeatherService } from "./common/open-weather/open-weather.service";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./common/auth/jwt-auth.guard";
import { JwtStrategy } from "./common/auth/jwt.strategy";

@Module({
  imports: [UserModule, InsightsModule, AuthModule],
  controllers: [],
  providers: [
    OpenAiService,
    OpenWeatherService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
