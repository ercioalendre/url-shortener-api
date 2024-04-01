import { Public } from '@decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';

@Public()
@Controller('health-check')
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
