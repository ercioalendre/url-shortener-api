import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { StaticErrors } from '@static/static-errors';
import { DeleteOneUserOutputDto } from '@modules/user/dtos/output/delete-one-user-output.dto';
import { AppCrypto } from '@utilities/app-crypto';
import { StaticKeys } from '@static/static-keys';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';

@Injectable()
export class SoftDeleteOneUserByIdService {
  constructor(
    private readonly userPrismaRepository: UserPrismaRepository,
    private readonly appCrypto: AppCrypto,
  ) {}

  public async execute(
    id: string,
    sessionUser: UserBaseOutputDto,
  ): Promise<DeleteOneUserOutputDto> {
    const userExists = await this.userPrismaRepository.getOneUnique({ id });

    if (!userExists) {
      throw new NotFoundException(
        StaticErrors.THE_USER_YOU_ARE_TRYING_TO_DELETE_RELATED_TO_THE_GIVEN_ID_DOES_NOT_EXIST,
      );
    }

    if (userExists.softDeletedAt) {
      throw new BadRequestException(
        StaticErrors.THE_USER_YOU_ARE_TRYING_TO_SOFT_DELETE_IS_ALREADY_SOFT_DELETED,
      );
    }

    const encryptedSoftDeletedUser =
      await this.userPrismaRepository.softDeleteOneById(id, sessionUser.id);

    return this.appCrypto.decryptData(
      encryptedSoftDeletedUser,
      StaticKeys.USER_ENCRYPTION_KEYS,
    );
  }
}
