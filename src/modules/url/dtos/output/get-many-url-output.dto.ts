import { UrlBaseOutputDto } from '@modules/url/dtos/output';

export class GetManyUrlOutputDto {
  public readonly data: UrlBaseOutputDto[];
  public readonly currentPage: number;
  public readonly perPage: number;
  public readonly lastPage: number;
  public readonly totalRecords: number;
}
