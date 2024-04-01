import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Throttle } from '@nestjs/throttler';
import { Public } from '@decorators/public.decorator';
import { RedirectionService } from '@modules/redirection/services/redirection.service';
import { Response } from 'express';

@Controller('')
@Public()
@ApiTags('Redirection')
export class RedirectionController extends AppController {
  constructor(private readonly redirectionService: RedirectionService) {
    super();
  }

  @Get(':shortenedPath')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({
    summary: 'Redirects to the original URL.',
  })
  public async handler(
    @Res() response: Response,
    @Param('shortenedPath') shortenedPath: string,
  ) {
    const originalUrl = await this.redirectionService.execute(shortenedPath);

    return response.redirect(originalUrl);
  }
}
