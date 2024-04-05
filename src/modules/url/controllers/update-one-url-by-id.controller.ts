import {
  Controller,
  Body,
  Patch,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateOneUrlInputDto } from '@modules/url/dtos/input/update-one-url-input.dto';
import { UpdateOneUrlOutputDto } from '@modules/url/dtos/output/update-one-url-output.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Request } from 'express';
import { Role } from '@modules/user/constants/role.enum';
import { Roles } from '@decorators';
import { Throttle } from '@nestjs/throttler';
import { UpdateOneUrlByIdService } from '@modules/url/services/update-one-url-by-id.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('url')
@Roles(Role.Admin, Role.User)
@ApiTags('Url')
export class UpdateOneUrlByIdController extends AppController {
  constructor(
    private readonly updateOneUrlByIdService: UpdateOneUrlByIdService,
  ) {
    super();
  }

  @Patch('update-one/:id')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseInterceptors(FilesInterceptor('urlFileList'))
  @ApiOperation({
    summary: 'Updates one single url by ID.',
  })
  public async handler(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: UpdateOneUrlInputDto,
  ): Promise<UpdateOneUrlOutputDto> {
    return this.updateOneUrlByIdService.execute(
      id,
      body,
      request['sessionUser'],
    );
  }
}
