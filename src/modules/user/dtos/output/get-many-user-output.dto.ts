import { UserBaseOutputDto } from '@modules/user/dtos/output';

export class GetManyUserOutputDto {
  public readonly data: UserBaseOutputDto[];
  public readonly currentPage: number;
  public readonly perPage: number;
  public readonly lastPage: number;
  public readonly totalRecords: number;
}
