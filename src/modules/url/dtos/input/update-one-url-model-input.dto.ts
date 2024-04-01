import { Type } from '@nestjs/common';
import { UrlModelBaseInputDto } from './url-model-base-input.dto';
import { PartialType } from '@nestjs/mapped-types';

export abstract class UpdateOneUrlModelInputDto extends PartialType(
  UrlModelBaseInputDto as Type<UrlModelBaseInputDto>,
) {
  public unhashedPassword?: string | null;

  public token?: string | null;

  public updatedAt: Date;

  public updatedBy?: string | null;
}
