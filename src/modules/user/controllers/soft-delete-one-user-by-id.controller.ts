import { Controller, Param, Delete, Req } from '@nestjs/common';
import { DeleteOneUserOutputDto } from '@modules/user/dtos/output/delete-one-user-output.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppController } from '@src/app.controller';
import { Role } from '@modules/user/constants/role.enum';
import { Roles } from '@decorators';
import { SoftDeleteOneUserByIdService } from '@modules/user/services/soft-delete-one-user-by-id.service';

@Controller('user')
@Roles(Role.Admin)
@ApiTags('User')
export class SoftDeleteOneUserByIdController extends AppController {
  constructor(
    private readonly softDeleteOneUserByIdService: SoftDeleteOneUserByIdService,
  ) {
    super();
  }

  @Delete('soft-delete-one/:id')
  @ApiOperation({
    summary: 'Soft deletes one single user by ID.',
  })
  public async handler(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<DeleteOneUserOutputDto> {
    return await this.softDeleteOneUserByIdService.execute(
      id,
      request['sessionUser'],
    );
  }
}
