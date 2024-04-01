import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { StaticErrors } from '@static/static-errors';
import { urlHasProtocol } from '@modules/url/utilities/urlHasProtocol';

@Injectable()
export class RedirectionService {
  constructor(private readonly urlPrismaRepository: UrlPrismaRepository) {}

  public async execute(shortenedPath: string): Promise<string> {
    const urlExists = await this.urlPrismaRepository.getOneUnique({
      shortenedPath,
    });

    if (!urlExists) {
      throw new NotFoundException(
        StaticErrors.THE_URL_RELATED_TO_THE_GIVEN_SHORTENEDPATH_DOES_NOT_EXIST,
      );
    }

    const { originalUrl } = urlExists;

    const isOriginalUrlValid = urlHasProtocol(originalUrl);

    if (!isOriginalUrlValid) {
      throw new BadRequestException(
        StaticErrors.THE_URL_RELATED_TO_THE_GIVEN_SHORTENEDPATH_IS_INVALID,
      );
    }

    await this.urlPrismaRepository.updateViewsById(
      urlExists.id,
      urlExists.views + 1,
    );

    return originalUrl;
  }
}
