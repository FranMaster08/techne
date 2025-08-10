import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../shared/enums/roles/role.enum';

export class MeResponseDto {
    @ApiProperty({ example: '1' }) id: string;
    @ApiProperty({ example: 'user@mail.com' }) email: string;
    @ApiProperty({ enum: Role, example: Role.User }) role: Role;
}