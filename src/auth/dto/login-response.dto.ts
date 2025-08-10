import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../shared/enums/roles/role.enum';

export class AuthUserDto {
    @ApiProperty({ example: '1' }) id: string;
    @ApiProperty({ example: 'user@mail.com' }) email: string;
    @ApiProperty({ enum: Role, example: Role.User }) role: Role;
}

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOi...' }) access_token: string;
    @ApiProperty({ example: 'Bearer' }) token_type: string;
    @ApiProperty({ type: AuthUserDto }) user: AuthUserDto;
}