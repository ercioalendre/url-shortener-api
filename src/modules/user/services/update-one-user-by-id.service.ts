import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppCrypto } from '@utilities/app-crypto';
import { StaticKeys } from '@static/static-keys';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { StaticErrors } from '@static/static-errors';
import { UpdateOneUserByIdInputDto } from '@modules/user/dtos/input/update-one-user-by-id-input.dto';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';
import { UpdateOneUserByIdOutputDto } from '@modules/user/dtos/output/update-one-user-by-id-output.dto';
import { UpdateOneUserModelInputDto } from '@modules/user/dtos/input/update-one-user-model-input.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UpdateOneUserByIdService {
  constructor(
    private readonly userPrismaRepository: UserPrismaRepository,
    private readonly appCrypto: AppCrypto,
    private readonly configService: ConfigService,
  ) {}

  public async execute(
    id: string,
    updateOneUserInputDto: UpdateOneUserByIdInputDto,
    sessionUser: UserBaseOutputDto,
  ): Promise<UpdateOneUserByIdOutputDto> {
    const userExists = await this.userPrismaRepository.getOneUnique({ id });

    if (!userExists) {
      throw new NotFoundException(
        StaticErrors.THE_USER_YOU_ARE_TRYING_TO_UPDATE_RELATED_TO_THE_GIVEN_ID_DOES_NOT_EXIST,
      );
    }

    if (updateOneUserInputDto.email) {
      const encryptedEmail = this.appCrypto.encrypt(
        updateOneUserInputDto.email,
        StaticKeys.USER_ENCRYPTION_KEYS.email,
      );

      const userByEmail = await this.userPrismaRepository.getOne({
        email: encryptedEmail,
        NOT: {
          id,
        },
      });

      if (userByEmail) {
        throw new ConflictException(
          StaticErrors.THE_EMAIL_ADDRESS_OF_THE_USER_YOU_ARE_TRYING_TO_UPDATE_IS_ALREADY_TAKEN,
        );
      }
    }

    const decryptedUpdatedUserModel = {
      ...updateOneUserInputDto,
      updatedAt: new Date(),
      updatedBy: sessionUser.id,
    };

    const encryptedUpdatedUserModel =
      this.appCrypto.encryptData<UpdateOneUserModelInputDto>(
        decryptedUpdatedUserModel,
        StaticKeys.USER_ENCRYPTION_KEYS,
      );

    if (updateOneUserInputDto.password) {
      encryptedUpdatedUserModel.password = await hash(
        updateOneUserInputDto.password,
        Number(this.configService.getOrThrow('PASSWORD_SALT')),
      );
    }

    const encryptedUpdatedUser = await this.userPrismaRepository.updateOneById(
      id,
      encryptedUpdatedUserModel,
    );

    return this.appCrypto.decryptData(
      encryptedUpdatedUser,
      StaticKeys.USER_ENCRYPTION_KEYS,
    );
  }
}
