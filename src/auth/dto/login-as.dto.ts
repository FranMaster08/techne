import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../shared/enums/roles/role.enum';

export class LoginAsDto {
    @ApiProperty({ enum: Role, example: Role.Admin })
    @IsEnum(Role)
    role: Role;
}