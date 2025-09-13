import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { InsightsService } from './insights.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5 * 60 * 1000,
      max: 1000,
    }),
  ],
  controllers: [],
  providers: [InsightsService],
})
export class InsightsModule {}
