import { ApiProperty } from "@nestjs/swagger"
import { IsAlphanumeric, IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class RegisterCredentialsDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(3)
    @MaxLength(64)
    login: string

    @ApiProperty()
    @IsIn(['teacher', 'student'])
    role : 'teacher' | 'student'
}

export class LoginCredentialsDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(3)
    @MaxLength(64)
    login: string
}