import { Controller, Param, Delete } from '@nestjs/common';
import { DeleteOneUserOutputDto } from '@modules/user/dtos/output/delete-one-user-output.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Role } from '@modules/user/constants/role.enum';
import { Roles } from '@decorators/roles.decorator';
import { HardDeleteOneUserByIdService } from '@modules/user/services/hard-delete-one-user-by-id.service';

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
