import { UrlModelBaseOutputDto } from './url-model-base-output.dto';

export class GetOneUrlWithTokenOutputDto extends UrlModelBaseOutputDto {
  public token: string;
}
