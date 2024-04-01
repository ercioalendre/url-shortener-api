import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { StaticErrors } from '@static/static-errors';
import { DeleteOneUrlOutputDto } from '@modules/url/dtos/output/delete-one-url-output.dto';
import { addShortenedUrlToUrl } from '@modules/url/utilities/addShortenedUrlToUrl';

@Injectable()
export class HardDeleteOneUrlByIdService {
  constructor(private readonly urlPrismaRepository: UrlPrismaRepository) {}

  public async execute(id: string): Promise<DeleteOneUrlOutputDto> {
    const urlExists = await this.urlPrismaRepository.getOneUnique({ id });

    if (!urlExists) {
      throw new NotFoundException(
        StaticErrors.THE_URL_YOU_ARE_TRYING_TO_DELETE_RELATED_TO_THE_GIVEN_ID_DOES_NOT_EXIST,
      );
    }

    if (!urlExists.softDeletedAt) {
      throw new BadRequestException(
        StaticErrors.THE_URL_YOU_ARE_TRYING_TO_HARD_DELETE_IS_NOT_SOFT_DELETED,
      );
    }

    const hardDeletedUrl = await this.urlPrismaRepository.hardDeleteOneById(id);

    return addShortenedUrlToUrl(hardDeletedUrl);
  }
}
