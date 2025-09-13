import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './common/prisma/prisma.service';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
