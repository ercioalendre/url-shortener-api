import { Type } from '@nestjs/common';
import { UrlModelBaseInputDto } from '@modules/url/dtos/input';
import { PartialType } from '@nestjs/mapped-types';

export abstract class UpdateOneUrlModelInputDto extends PartialType(
  UrlModelBaseInputDto as Type<UrlModelBaseInputDto>,
) {
  public unhashedPassword?: string | null;

  public token?: string | null;

  public updatedAt: Date;

  public updatedBy?: string | null;
}
