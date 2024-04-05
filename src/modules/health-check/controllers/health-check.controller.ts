import { Public } from '@decorators';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src';

@Public()
@Controller('/app/health-check')
@ApiTags('App')
export class HealthCheckController extends AppController {
  @Get()
  @ApiOperation({
    summary: 'Checks application integrity.',
  })
  public handler() {
    return;
  }
}
