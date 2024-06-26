import { Controller, Param, Delete, Req } from '@nestjs/common';
import { DeleteOneUrlOutputDto } from '@modules/url/dtos/output';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Role } from '@modules/user/constants';
import { Roles } from '@decorators';
import { SoftDeleteOneUrlByIdService } from '@modules/url/services';

@Controller('url')
@Roles(Role.Admin, Role.User)
@ApiTags('Url')
export class SoftDeleteOneUrlByIdController extends AppController {
  constructor(
    private readonly softDeleteOneUrlByIdService: SoftDeleteOneUrlByIdService,
  ) {
    super();
  }

  @Delete('soft-delete-one/:id')
  @ApiOperation({
    summary: 'Soft deletes one single url by ID.',
  })
  public async handler(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<DeleteOneUrlOutputDto> {
    return await this.softDeleteOneUrlByIdService.execute(
      id,
      request['sessionUser'],
    );
  }
}
