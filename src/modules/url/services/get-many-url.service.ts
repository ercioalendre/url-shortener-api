import { Injectable } from '@nestjs/common';
import { UrlPrismaRepository } from '@modules/url/repositories';
import {
  GetManyUrlOutputDto,
  UrlBaseOutputDto,
} from '@modules/url/dtos/output';
import { SearchParams } from '@src/types';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';
import { Role } from '@modules/user/constants';
import { addShortenedUrlToUrl } from '@modules/url/utilities';

@Injectable()
export class GetManyUrlService {
  constructor(private readonly urlPrismaRepository: UrlPrismaRepository) {}

  public async execute(
    sessionUser: UserBaseOutputDto,
    searchParams?: SearchParams | null,
  ): Promise<GetManyUrlOutputDto> {
    const createdBy =
      sessionUser.role !== Role.Admin ? sessionUser.id : undefined;

    const urlList = await this.urlPrismaRepository.getMany(
      searchParams,
      createdBy,
    );

    const parsedUrlList: UrlBaseOutputDto[] = [];

    for (const url of urlList.data) {
      if (sessionUser.role !== Role.Admin && url.softDeletedAt) {
        continue;
      }

      parsedUrlList.push(addShortenedUrlToUrl(url));
    }

    return {
      ...urlList,
      data: parsedUrlList,
    };
  }
}
