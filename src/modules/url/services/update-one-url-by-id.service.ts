import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlPrismaRepository } from '@modules/url/repositories';
import { StaticErrors } from '@static';
import { UpdateOneUrlInputDto } from '@modules/url/dtos/input';
import { UpdateOneUrlOutputDto } from '@modules/url/dtos/output';
import { UserBaseOutputDto } from '@modules/user/dtos/output/user-base-output.dto';
import { addShortenedUrlToUrl } from '@modules/url/utilities';
import { Role } from '@modules/user/constants';

@Injectable()
export class UpdateOneUrlByIdService {
  constructor(private readonly urlPrismaRepository: UrlPrismaRepository) {}

  public async execute(
    id: string,
    updateOneUrlInputDto: UpdateOneUrlInputDto,
    sessionUser: UserBaseOutputDto,
  ): Promise<UpdateOneUrlOutputDto> {
    const urlExists = await this.urlPrismaRepository.getOneUnique({
      id,
    });

    if (!urlExists) {
      throw new NotFoundException(
        StaticErrors.THE_URL_YOU_ARE_TRYING_TO_UPDATE_RELATED_TO_THE_GIVEN_ID_DOES_NOT_EXIST,
      );
    }

    if (sessionUser.role !== Role.Admin && urlExists.softDeletedAt) {
      throw new BadRequestException(
        StaticErrors.THE_URL_YOU_ARE_TRYING_TO_UPDATE_IS_SOFT_DELETED,
      );
    }

    const updatedUrlModel = {
      originalUrl: updateOneUrlInputDto.originalUrl,
      updatedAt: new Date(),
      updatedBy: sessionUser.id,
    };

    const updatedUrl = await this.urlPrismaRepository.updateOneById(
      id,
      updatedUrlModel,
    );

    return addShortenedUrlToUrl(updatedUrl);
  }
}
