import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateGroupDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    @MaxLength(64)
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    @MaxLength(256)
    description?: string
}