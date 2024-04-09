import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UrlPrismaRepository } from '@modules/url/repositories';
import {
  CreateOneUrlInputDto,
  CreateOneUrlModelInputDto,
} from '@modules/url/dtos/input';
import { CreateOneUrlOutputDto } from '@modules/url/dtos/output';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';
import { StaticErrors } from '@static';
import { urlHasProtocol, addShortenedUrlToUrl } from '@modules/url/utilities';

@Injectable()
export class CreateOneUrlService {
  constructor(private readonly urlPrismaRepository: UrlPrismaRepository) {}

  public async execute(
    createOneUrlInputDto: CreateOneUrlInputDto,
    sessionUser: UserBaseOutputDto,
  ): Promise<CreateOneUrlOutputDto> {
    const parsedOriginalUrl = this.parseOriginalUrl(
      createOneUrlInputDto.originalUrl,
    );

    this.validateOriginalUrl(parsedOriginalUrl);

    const shortenedPath = this.generateShortenedPath();

    const newUrlModel: CreateOneUrlModelInputDto = {
      id: randomUUID(),
      originalUrl: parsedOriginalUrl,
      shortenedPath,
      views: 0,
      createdAt: new Date(),
      createdBy: sessionUser?.id,
    };

    const createdUrl = await this.urlPrismaRepository.createOne(newUrlModel);

    return addShortenedUrlToUrl(createdUrl);
  }

  private parseOriginalUrl(url: string): string {
    const isOriginalUrlProtocolValid = urlHasProtocol(url);

    if (!isOriginalUrlProtocolValid) {
      return `http://${url}`;
    }

    return url;
  }

  private validateOriginalUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new BadRequestException(
        StaticErrors.THE_GIVEN_ORIGINALURL_IS_INVALID,
      );
    }
  }

  private generateShortenedPath() {
    const stringLength = 6;

    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    const charactersLength = characters.length;

    for (let i = 0; i < stringLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
