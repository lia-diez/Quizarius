import { Controller, Post, UseGuards, Request, Body, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { AttemptDto, CreateAttemptDto, ResultDto } from './dto/attempt.dto';
import { AttemptInfo } from './types/attempt';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Quiz } from 'src/quiz/types/quiz';

@ApiTags('attempt')
@Controller('attempt')
export class AttemptController {
    constructor(private readonly attemptService: AttemptService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(Role.Student)
    @Post('create')
    public async startAttempt(
        @Request() req,
        @Body() dto: CreateAttemptDto
    ): Promise<AttemptInfo> {
        return this.attemptService.startAttempt(req.user.id, dto.quizId);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(Role.Student)
    @Post('submit')
    public async submitAttempt(
        @Request() req,
        @Body() dto: AttemptDto
    ): Promise<{ id: string }> {
        return this.attemptService.submitAttempt(req.user.id, dto);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    // TODO: add role check, it should be only available for teachers
    @Get(':id')
    public async getAttempt(
        @Request() req,
        @Param('id', new ParseUUIDPipe()) attemptId: string
    ): Promise<{ attempt: AttemptInfo, quiz: Quiz }> {
        return this.attemptService.getAttempt(req.user.id, attemptId);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('result/:id')
    public async getResult(
        @Request() req,
        @Param('id', new ParseUUIDPipe()) attemptId: string
    ): Promise<string> {
        return 'loh';
    }

    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(Role.Teacher)
    @Get('group/:groupId/student/:studentId')
    public async getAttemptsByStudentWithResult(
        @Request() req,
        @Param('groupId', new ParseUUIDPipe()) groupId: string,
        @Param('studentId', new ParseUUIDPipe()) studentId: string,
        @Query() query: ResultDto
    ): Promise<{attempt: AttemptInfo, quiz: Quiz, grade?: number}[]> {
        if (query.result)
            return this.attemptService.getAttemptsByStudentWithResult(req.user.id, groupId, studentId);
        else
            return this.attemptService.getAttemptsByStudent(req.user.id, groupId, studentId);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(Role.Teacher)
    @Post(':attemptId/question/:questionId/verify')
    public async verifyQuestion(
        @Request() req,
        @Param('attemptId', new ParseUUIDPipe()) attemptId: string,
        @Param('questionId', new ParseUUIDPipe()) questionId: string
    ): Promise<{id: string, value: boolean}> {
        return this.attemptService.verifyAnswerOption(req.user.id, attemptId, questionId, true);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(Role.Teacher)
    @Post(':attemptId/question/:questionId/decline')
    public async declineQuestion(
        @Request() req,
        @Param('attemptId', new ParseUUIDPipe()) attemptId: string,
        @Param('questionId', new ParseUUIDPipe()) questionId: string
    ): Promise<{id: string, value: boolean}> {
        return this.attemptService.verifyAnswerOption(req.user.id, attemptId, questionId, false);
    }
}