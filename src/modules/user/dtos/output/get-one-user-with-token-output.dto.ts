import { UserModelBaseOutputDto } from '@modules/user/dtos/output';

export class GetOneUserWithTokenOutputDto extends UserModelBaseOutputDto {
  public token: string;
}
