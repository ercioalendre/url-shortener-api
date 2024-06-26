import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src';
import { Role } from '@modules/user/constants';
import { Roles } from '@decorators';
import { GetManyUrlInputDto } from '@modules/url/dtos/input';
import { GetManyUrlService } from '@modules/url/services';
import { Response, Request } from 'express';
import { UrlBaseOutputDto } from '@modules/url/dtos/output';

@Controller('url')
@Roles(Role.Admin, Role.User)
@ApiTags('Url')
export class GetManyUrlController extends AppController {
  constructor(private readonly getManyUrlService: GetManyUrlService) {
    super();
  }

  @Get('get-many')
  @ApiOperation({
    summary: 'Gets many urls.',
  })
  public async handler(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Query() searchParams?: GetManyUrlInputDto | null,
  ): Promise<UrlBaseOutputDto[]> {
    const urlListWithPaginationMetadata = await this.getManyUrlService.execute(
      request['sessionUser'],
      searchParams,
    );

    const { data, ...metadata } = urlListWithPaginationMetadata;

    response.header('currentPage', String(metadata.currentPage));

    response.header('lastPage', String(metadata.lastPage));

    response.header('perPage', String(metadata.perPage));

    response.header('totalRecords', String(metadata.totalRecords));

    return data;
  }
}
