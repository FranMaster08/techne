import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID único del usuario' })
  id: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  name: string;

  @ApiProperty({ example: 'juan.perez@email.com', description: 'Correo electrónico del usuario' })
  email: string;

  @ApiProperty({ example: 30, description: 'Fecha de nacimiento del usuario'})
  birthDate?: Date;

  @ApiProperty({ example: 'beneficiario', description: 'Rol del usuario' })
  rol: string;

}
