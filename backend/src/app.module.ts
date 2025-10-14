import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
// import { PollsModule } from './polls/polls.module';
import { AuthModule } from './auth/auth.module';

@Module({
  // imports: [UsersModule, PrismaModule, PollsModule, AuthModule],
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
