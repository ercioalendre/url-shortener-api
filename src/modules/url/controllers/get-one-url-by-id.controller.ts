import { Controller, Get, Param, Req } from '@nestjs/common';
import { GetOneUrlOutputDto } from '@modules/url/dtos/output';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src';
import { Role } from '@modules/user/constants';
import { Roles } from '@decorators';
import { GetOneUrlByIdService } from '@modules/url/services';
import { addShortenedUrlToUrl } from '@modules/url/utilities';

@Controller('url')
@Roles(Role.Admin, Role.User)
@ApiTags('Url')
export class GetOneUrlByIdController extends AppController {
  constructor(private readonly getOneUrlByIdService: GetOneUrlByIdService) {
    super();
  }

  @Get('get-one/:id')
  @ApiOperation({
    summary: 'Gets one single url by ID.',
  })
  public async handler(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<GetOneUrlOutputDto | null> {
    const url = await this.getOneUrlByIdService.execute(
      id,
      request['sessionUser'],
    );

    return addShortenedUrlToUrl(url);
  }
}
