import { Controller, Param, Delete } from '@nestjs/common';
import { DeleteOneUserOutputDto } from '@modules/user/dtos/output';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src';
import { Role } from '@modules/user/constants';
import { Roles } from '@decorators';
import { HardDeleteOneUserByIdService } from '@modules/user/services';

@Controller('user')
@Roles(Role.Admin)
@ApiTags('User')
export class HardDeleteOneUserByIdController extends AppController {
  constructor(
    private readonly hardDeleteOneUserByIdService: HardDeleteOneUserByIdService,
  ) {
    super();
  }

  @Delete('hard-delete-one/:id')
  @ApiOperation({
    summary: 'Hard deletes one single user by ID.',
  })
  public async handler(
    @Param('id') id: string,
  ): Promise<DeleteOneUserOutputDto> {
    return await this.hardDeleteOneUserByIdService.execute(id);
  }
}
