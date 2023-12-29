import { Module } from '@nestjs/common';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuizModule } from 'src/quiz/quiz.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuizService } from 'src/quiz/quiz.service';
import { GroupModule } from 'src/group/group.module';
import { GroupService } from 'src/group/group.service';

@Module({
  imports: [AuthModule, PrismaModule, QuizModule, GroupModule],
  controllers: [AttemptController],
  providers: [AttemptService, PrismaService, QuizService, GroupService]
})
export class AttemptModule {}
