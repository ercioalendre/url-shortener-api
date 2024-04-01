import { Controller, Get, Param, Req } from '@nestjs/common';
import { GetOneUrlOutputDto } from '@modules/url/dtos/output/get-one-url-output.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Role } from '@modules/user/constants/role.enum';
import { Roles } from '@decorators/roles.decorator';
import { GetOneUrlByIdService } from '@modules/url/services/get-one-url-by-id.service';
import { addShortenedUrlToUrl } from '@modules/url/utilities/addShortenedUrlToUrl';

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
