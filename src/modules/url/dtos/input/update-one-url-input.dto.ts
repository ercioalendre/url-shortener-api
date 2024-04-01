import { PartialType } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { UrlBaseInputDto } from './url-base-input.dto';

export class UpdateOneUrlInputDto extends PartialType(
  UrlBaseInputDto as Type<UrlBaseInputDto>,
) {}
