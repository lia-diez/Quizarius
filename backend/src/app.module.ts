import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { PrismaModule } from './prisma/prisma.module';
import { GroupModule } from './group/group.module';
import { AttemptModule } from './attempt/attempt.module';

@Module({
  imports: [QuizModule, AuthModule, PrismaModule, GroupModule, AttemptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
