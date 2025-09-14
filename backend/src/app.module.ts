import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { InsightsModule } from './insights/insights.module';
import { OpenAiService } from './common/open-ai/open-ai.service';
import { OpenWeatherService } from './common/open-weather/open-weather.service';

@Module({
  imports: [UserModule, InsightsModule],
  controllers: [],
  providers: [OpenAiService, OpenWeatherService],
})
export class AppModule {}
