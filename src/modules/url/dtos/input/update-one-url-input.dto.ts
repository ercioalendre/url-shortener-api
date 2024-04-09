import { PartialType } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { UrlBaseInputDto } from '@modules/url/dtos/input';

export class UpdateOneUrlInputDto extends PartialType(
  UrlBaseInputDto as Type<UrlBaseInputDto>,
) {}
