import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { StaticErrors } from '@static/static-errors';
import { DeleteOneUrlOutputDto } from '@modules/url/dtos/output/delete-one-url-output.dto';
import { addShortenedUrlToUrl } from '@modules/url/utilities/addShortenedUrlToUrl';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';

@Injectable()
export class SoftDeleteOneUrlByIdService {
  constructor(private readonly urlPrismaRepository: UrlPrismaRepository) {}

  public async execute(
    id: string,
    sessionUser: UserBaseOutputDto,
  ): Promise<DeleteOneUrlOutputDto> {
    const urlExists = await this.urlPrismaRepository.getOneUnique({ id });

    if (!urlExists) {
      throw new NotFoundException(
        StaticErrors.THE_URL_YOU_ARE_TRYING_TO_DELETE_RELATED_TO_THE_GIVEN_ID_DOES_NOT_EXIST,
      );
    }

    if (urlExists.softDeletedAt) {
      throw new BadRequestException(
        StaticErrors.THE_URL_YOU_ARE_TRYING_TO_SOFT_DELETE_IS_ALREADY_SOFT_DELETED,
      );
    }

    const softDeletedUrl = await this.urlPrismaRepository.softDeleteOneById(
      id,
      sessionUser.id,
    );

    return addShortenedUrlToUrl(softDeletedUrl);
  }
}
