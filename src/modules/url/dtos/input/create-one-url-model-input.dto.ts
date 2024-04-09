import { UrlModelBaseInputDto } from '@modules/url/dtos/input';

export abstract class CreateOneUrlModelInputDto extends UrlModelBaseInputDto {
  public createdBy?: string | null;
}
