import { UrlModelBaseInputDto } from './url-model-base-input.dto';

export abstract class CreateOneUrlModelInputDto extends UrlModelBaseInputDto {
  public createdBy?: string | null;
}
