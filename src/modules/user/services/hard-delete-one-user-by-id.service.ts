import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { StaticErrors } from '@static/static-errors';
import { DeleteOneUserOutputDto } from '@modules/user/dtos/output/delete-one-user-output.dto';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { AppCrypto } from '@utilities/app-crypto';
import { StaticKeys } from '@static/static-keys';

@Injectable()
export class HardDeleteOneUserByIdService {
  constructor(
    private readonly userPrismaRepository: UserPrismaRepository,
    private readonly urlPrismaRepository: UrlPrismaRepository,
    private readonly appCrypto: AppCrypto,
  ) {}

  public async execute(id: string): Promise<DeleteOneUserOutputDto> {
    const userExists = await this.userPrismaRepository.getOneUnique({ id });

    if (!userExists) {
      throw new NotFoundException(
        StaticErrors.THE_USER_YOU_ARE_TRYING_TO_DELETE_RELATED_TO_THE_GIVEN_ID_DOES_NOT_EXIST,
      );
    }

    const userHasUrlRelation = await this.urlPrismaRepository.getOne({
      createdBy: userExists.id,
    });

    if (userHasUrlRelation) {
      throw new BadRequestException(
        StaticErrors.THE_USER_YOU_ARE_TRYING_TO_HARD_DELETE_HAS_ONE_OR_MORE_EXISTING_URLS_RELATED_TO_IT,
      );
    }

    const userHasUserRelation = await this.userPrismaRepository.getOne({
      createdBy: userExists.id,
    });

    if (userHasUserRelation) {
      throw new BadRequestException(
        StaticErrors.THE_USER_YOU_ARE_TRYING_TO_HARD_DELETE_HAS_ONE_OR_MORE_EXISTING_USERS_RELATED_TO_IT,
      );
    }

    if (!userExists.softDeletedAt) {
      throw new BadRequestException(
        StaticErrors.THE_USER_YOU_ARE_TRYING_TO_HARD_DELETE_IS_NOT_SOFT_DELETED,
      );
    }

    const encryptedHardDeletedUser =
      await this.userPrismaRepository.hardDeleteOneById(id);

    return this.appCrypto.decryptData(
      encryptedHardDeletedUser,
      StaticKeys.USER_ENCRYPTION_KEYS,
    );
  }
}
