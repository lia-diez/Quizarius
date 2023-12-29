import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { GroupModule } from 'src/group/group.module';
import { GroupService } from 'src/group/group.service';

@Module({
  providers: [QuizService, GroupService],
  controllers: [QuizController],
  imports: [AuthModule, PrismaModule, GroupModule]
})
export class QuizModule { }
