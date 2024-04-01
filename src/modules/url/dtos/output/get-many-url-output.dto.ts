import { UrlBaseOutputDto } from './url-base-output.dto';

export class GetManyUrlOutputDto {
  public readonly data: UrlBaseOutputDto[];
  public readonly currentPage: number;
  public readonly perPage: number;
  public readonly lastPage: number;
  public readonly totalRecords: number;
}
