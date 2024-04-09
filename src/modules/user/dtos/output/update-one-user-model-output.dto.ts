import { UserModelBaseOutputDto } from '@modules/user/dtos/output';

export abstract class UpdateOneUserModelOutputDto extends UserModelBaseOutputDto {
  public readonly token?: string | null;

  public readonly updatedAt: Date;

  public readonly updatedBy?: string | null;
}
