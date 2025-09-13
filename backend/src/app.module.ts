import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [UserModule, InsightsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
