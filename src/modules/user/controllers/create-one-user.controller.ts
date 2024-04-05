import { Controller, Post, Body, Req } from '@nestjs/common';
import { CreateOneUserInputDto } from '@modules/user/dtos/input/create-one-user-input.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Throttle } from '@nestjs/throttler';
import { CreateOneUserService } from '@modules/user/services/create-one-user.service';
import { Public } from '@decorators';

@Controller('user')
@Public()
@ApiTags('User')
export class CreateOneUserController extends AppController {
  constructor(private readonly createOneUserService: CreateOneUserService) {
    super();
  }

  @Post('create-one')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({
    summary: 'Creates one single user.',
  })
  public async handler(
    @Req() request: Request,
    @Body()
    createUserInputDto: CreateOneUserInputDto,
  ) {
    return await this.createOneUserService.execute(
      createUserInputDto,
      request['sessionUser'],
    );
  }
}
