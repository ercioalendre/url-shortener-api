import { UrlModelBaseOutputDto } from '@modules/url/dtos/output';

export class GetOneUrlWithPasswordOutputDto extends UrlModelBaseOutputDto {
  public password: string;
}
