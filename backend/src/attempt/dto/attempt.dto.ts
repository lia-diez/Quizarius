import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, IsUUID, isBoolean } from "class-validator";
import { UUID } from "crypto";

export class CreateAttemptDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  quizId: UUID;
}

export class AttemptDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  attemptId: UUID;

  @ApiProperty()
  answers: AttemptAnswerDto[];
}

export class AttemptAnswerDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  questionId: UUID;

  @ApiProperty()
  options: (string | UUID)[]; // string for open questions
}

export class ResultDto {
  @ApiProperty()
  result: boolean;
}