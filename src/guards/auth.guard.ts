import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StaticErrors } from '@static/static-errors';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { IS_PUBLIC_KEY } from '@decorators';
import { Reflector } from '@nestjs/core';
import { AppCrypto } from '@utilities/app-crypto';
import { StaticKeys } from '@static/static-keys';
import { AppConfig } from '@config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserPrismaRepository,
    private readonly reflector: Reflector,
    private readonly appCrypto: AppCrypto,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (isPublic) {
      if (token) {
        await this.validateToken(token, request);
      }

      return true;
    }

    if (!token) {
      throw new UnauthorizedException(StaticErrors.INVALID_CREDENTIALS);
    }

    await this.validateToken(token, request);

    return true;
  }

  private async validateToken(token: string, request: Request) {
    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        issuer: AppConfig.getOrThrow('APP_NAME'),
        audience: AppConfig.getOrThrow('JWT_AUTH_USER_AUDIENCE'),
        secret: AppConfig.getOrThrow('JWT_AUTH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(StaticErrors.INVALID_CREDENTIALS);
    }

    const encryptedUserExists = await this.userRepository.getOneByIdWithToken(
      payload.sub,
    );

    if (!encryptedUserExists || encryptedUserExists.softDeletedAt) {
      throw new UnauthorizedException(StaticErrors.INVALID_CREDENTIALS);
    }

    if (encryptedUserExists.token !== token) {
      throw new UnauthorizedException(StaticErrors.INVALID_CREDENTIALS);
    }

    encryptedUserExists.token = undefined;

    const decryptedUser = this.appCrypto.decryptData(
      encryptedUserExists,
      StaticKeys.USER_ENCRYPTION_KEYS,
    );

    request['sessionUser'] = decryptedUser;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
