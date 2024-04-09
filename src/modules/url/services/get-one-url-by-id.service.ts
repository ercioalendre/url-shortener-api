import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlPrismaRepository } from '@modules/url/repositories';
import { GetOneUrlOutputDto } from '@modules/url/dtos/output';
import { StaticErrors } from '@static';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';
import { Role } from '@modules/user/constants';

@Injectable()
export class GetOneUrlByIdService {
  constructor(private readonly urlPrismaRepository: UrlPrismaRepository) {}

  public async execute(
    id: string,
    sessionUser: UserBaseOutputDto,
  ): Promise<GetOneUrlOutputDto> {
    const createdBy =
      sessionUser.role !== Role.Admin ? sessionUser.id : undefined;

    const url = await this.urlPrismaRepository.getOne({
      id,
      createdBy,
    });

    if (!url) {
      throw new NotFoundException(
        StaticErrors.THE_URL_YOU_ARE_LOOKING_FOR_RELATED_TO_THE_GIVEN_ID_DOES_NOT_EXIST,
      );
    }

    if (sessionUser.role !== Role.Admin && url.softDeletedAt) {
      throw new BadRequestException(
        StaticErrors.THE_URL_YOU_ARE_LOOKING_FOR_RELATED_TO_THE_GIVEN_ID_IS_SOFT_DELETED,
      );
    }

    return url;
  }
}
