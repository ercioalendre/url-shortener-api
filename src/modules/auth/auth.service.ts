import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StaticErrors } from '@static';
import { compare } from 'bcrypt';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { JwtService } from '@nestjs/jwt';
import {
  SignInUserInputDto,
  AuthUserInputDto,
  AuthUserOutputDto,
} from '@modules/auth/dtos';
import { AppCrypto } from '@utilities';
import { StaticKeys } from '@static';
import { AppConfig } from '@config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPrismaRepository: UserPrismaRepository,
    private readonly jwtService: JwtService,
    private readonly appCrypto: AppCrypto,
  ) {}

  async signInUser(signInUserInputDto: SignInUserInputDto): Promise<any> {
    const encryptedEmail = this.appCrypto.encrypt(
      String(signInUserInputDto.email),
      StaticKeys.USER_ENCRYPTION_KEYS.email,
    );

    const encryptedUserExists =
      await this.userPrismaRepository.getOneByEmailWithPassword(encryptedEmail);

    if (!encryptedUserExists || encryptedUserExists.softDeletedAt) {
      throw new UnauthorizedException(StaticErrors.INVALID_CREDENTIALS);
    }

    const passwordComparison = await compare(
      signInUserInputDto.password,
      encryptedUserExists.password,
    );

    if (!passwordComparison) {
      throw new UnauthorizedException(StaticErrors.INVALID_CREDENTIALS);
    }

    const decryptedUser = this.appCrypto.decryptData(
      encryptedUserExists,
      StaticKeys.USER_ENCRYPTION_KEYS,
    );

    const token = await this.jwtService.signAsync(
      {
        fullName: decryptedUser.fullName,
        role: decryptedUser.role,
      },
      {
        subject: decryptedUser.id,
        expiresIn: '1d',
        audience: AppConfig.getOrThrow('JWT_AUTH_USER_AUDIENCE'),
      },
    );

    await this.userPrismaRepository.updateOneById(decryptedUser.id, {
      token,
      updatedAt: new Date(),
      updatedBy: null,
    });

    return { token };
  }

  public async userMe(
    authUserInputDto: AuthUserInputDto,
  ): Promise<AuthUserOutputDto> {
    if (!authUserInputDto?.id) {
      throw new UnauthorizedException(StaticErrors.INVALID_CREDENTIALS);
    }

    return authUserInputDto;
  }
}
