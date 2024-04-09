import { UrlModelBaseOutputDto } from '@modules/url/dtos/output';

export class GetOneUrlWithTokenOutputDto extends UrlModelBaseOutputDto {
  public token: string;
}
