import { UserModelBaseOutputDto } from '@modules/user/dtos/output';

export class GetOneUserWithPasswordOutputDto extends UserModelBaseOutputDto {
  public password: string;
}
