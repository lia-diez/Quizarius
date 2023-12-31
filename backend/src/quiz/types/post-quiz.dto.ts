import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { UUID } from "crypto"

export class PostQuizInfoDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    groupId: UUID

    @ApiProperty()
    @IsBoolean()
    hasRetries: boolean

    @ApiProperty()
    @IsBoolean()
    hasTimeLimit: boolean

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    deadLine: Date

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    retries: number

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    timeLimitHours: number

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    timeLimitMinutes: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isVisible: boolean
}

export class PostQuizQuestionOptionDto {
    @ApiProperty()
    @IsBoolean()
    correct: boolean

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string
}

export class PostQuizQuestionDto {
    @ApiProperty()
    @IsBoolean()
    isOpen: boolean

    @ApiProperty({ type: [PostQuizQuestionOptionDto]})
    @ValidateNested({ each: true })
    @Type(() => PostQuizQuestionOptionDto)
    options: PostQuizQuestionOptionDto[]

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string
}

export class PostQuizQuestionWrapperDto {
    @ApiProperty({ type: PostQuizQuestionDto })
    @ValidateNested()
    @Type(() => PostQuizQuestionDto)
    value: PostQuizQuestionDto
}

export class PostQuizDto {
    @ApiProperty({ type: PostQuizInfoDto })
    @ValidateNested()
    @Type(() => PostQuizInfoDto)
    info: PostQuizInfoDto

    @ApiProperty({ type: [PostQuizQuestionWrapperDto] })
    @ValidateNested({ each: true })
    @Type(() => PostQuizQuestionWrapperDto)
    questions: PostQuizQuestionWrapperDto[]
}


