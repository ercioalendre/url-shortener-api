import { Type } from '@nestjs/common';
import { UserModelBaseInputDto } from '@modules/user/dtos/input';
import { PartialType } from '@nestjs/mapped-types';

export abstract class UpdateOneUserModelInputDto extends PartialType(
  UserModelBaseInputDto as Type<UserModelBaseInputDto>,
) {
  public unhashedPassword?: string | null;

  public token?: string | null;

  public updatedAt: Date;

  public updatedBy?: string | null;
}
