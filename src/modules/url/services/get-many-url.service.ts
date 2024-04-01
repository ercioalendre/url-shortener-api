import { Injectable } from '@nestjs/common';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { GetManyUrlOutputDto } from '@modules/url/dtos/output/get-many-url-output.dto';
import { SearchParams } from '@src/types/search-params.type';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';
import { Role } from '@modules/user/constants/role.enum';
import { addShortenedUrlToUrl } from '@modules/url/utilities/addShortenedUrlToUrl';
import { UrlBaseOutputDto } from '@modules/url/dtos/output/url-base-output.dto';

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
