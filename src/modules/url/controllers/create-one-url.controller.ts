import { Controller, Post, Body, Req } from '@nestjs/common';
import { CreateOneUrlInputDto } from '@modules/url/dtos/input';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src';
import { Throttle } from '@nestjs/throttler';
import { CreateOneUrlService } from '@modules/url/services';
import { Public } from '@decorators';

@Controller('url')
@Public()
@ApiTags('Url')
export class CreateOneUrlController extends AppController {
  constructor(private readonly createOneUrlService: CreateOneUrlService) {
    super();
  }

  @Post('create-one')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({
    summary: 'Creates one single url.',
  })
  public async handler(
    @Req() request: Request,
    @Body()
    createUrlInputDto: CreateOneUrlInputDto,
  ) {
    return await this.createOneUrlService.execute(
      createUrlInputDto,
      request['sessionUser'],
    );
  }
}
