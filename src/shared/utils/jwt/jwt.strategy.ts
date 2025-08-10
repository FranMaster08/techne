import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../../enums/roles/role.enum';

export type JwtPayload = { sub: string; email: string; role: Role };

// JwtStrategy
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true, // 👈
    });
  }

  async validate(req: any, payload: { sub: string; email: string; role: Role }) {
    const auth = req.headers?.authorization as string | undefined;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    // lo que retornes aquí será req.user
    return { ...payload, token };
  }
}