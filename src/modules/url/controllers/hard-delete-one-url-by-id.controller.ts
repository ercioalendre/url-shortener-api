import { Controller, Param, Delete } from '@nestjs/common';
import { DeleteOneUrlOutputDto } from '@modules/url/dtos/output';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Role } from '@modules/user/constants';
import { Roles } from '@decorators';
import { HardDeleteOneUrlByIdService } from '@modules/url/services';

@Controller('url')
@Roles(Role.Admin, Role.User)
@ApiTags('Url')
export class HardDeleteOneUrlByIdController extends AppController {
  constructor(
    private readonly hardDeleteOneUrlByIdService: HardDeleteOneUrlByIdService,
  ) {
    super();
  }

  @Delete('hard-delete-one/:id')
  @ApiOperation({
    summary: 'Hard deletes one single url by ID.',
  })
  public async handler(
    @Param('id') id: string,
  ): Promise<DeleteOneUrlOutputDto> {
    return await this.hardDeleteOneUrlByIdService.execute(id);
  }
}
