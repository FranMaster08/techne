import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/shared/utils/jwt/jwt.strategy';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES || '1d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule], // para usar JwtService y @UseGuards(AuthGuard('jwt'))
})
export class JwtAuthModule {}