import {
  Controller,
  Body,
  Patch,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateOneUserByIdInputDto } from '@modules/user/dtos/input/update-one-user-by-id-input.dto';
import { UpdateOneUserByIdOutputDto } from '@modules/user/dtos/output/update-one-user-by-id-output.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Request } from 'express';
import { Role } from '@modules/user/constants/role.enum';
import { Roles } from '@decorators';
import { Throttle } from '@nestjs/throttler';
import { UpdateOneUserByIdService } from '@modules/user/services/update-one-user-by-id.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
@Roles(Role.Admin)
@ApiTags('User')
export class UpdateOneUserByIdController extends AppController {
  constructor(
    private readonly updateOneUserByIdService: UpdateOneUserByIdService,
  ) {
    super();
  }

  @Patch('update-one/:id')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseInterceptors(FilesInterceptor('userFileList'))
  @ApiOperation({
    summary: 'Updates one single user by ID.',
  })
  public async handler(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: UpdateOneUserByIdInputDto,
  ): Promise<UpdateOneUserByIdOutputDto> {
    return this.updateOneUserByIdService.execute(
      id,
      body,
      request['sessionUser'],
    );
  }
}
