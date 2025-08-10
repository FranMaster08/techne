import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'user@mail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 6, example: 'secret123' })
    @IsString()
    @MinLength(6)
    password: string;
}