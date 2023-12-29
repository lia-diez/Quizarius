import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Quiz, QuizInfo } from './types/quiz';
import { PostQuizDto } from "./types/post-quiz.dto";
import { dtoToQuiz } from "./mappers";
import { QuizService } from "./quiz.service";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles/roles.guard";
import { Roles } from "src/auth/roles/roles.decorator";
import { Role } from "src/auth/roles/roles.enum";
import { User } from "src/auth/types/user";

@Controller('quiz')
@ApiTags('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) { }

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Get()
	public async getQuizzesInfo(
		@Request() req
	): Promise<QuizInfo[]> {
		return this.quizService.getQuizzesInfo(req.user.id);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Get('group/:id')
	public async getQuizzesInfoByGroup(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Request() req
	): Promise<QuizInfo[]> {
		return this.quizService.getQuizzesByGroup(req.user.id, id);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@Get(':id')
	public async getQuiz(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Request() req
	): Promise<Quiz> {
		return this.quizService.findQuiz(req.user as User, id);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@ApiBearerAuth()
	@Roles(Role.Teacher)
	@Post('create')
	public async PostQuiz(
		@Request() req,
		@Body() dto: PostQuizDto
	): Promise<Quiz> {
		const quiz = dtoToQuiz(dto);
		this.quizService.postQuiz(req.user.id, quiz);
		return quiz;
	}
}
