import { UrlModelBaseOutputDto } from '@modules/url/dtos/output';

export abstract class UpdateOneUrlModelOutputDto extends UrlModelBaseOutputDto {
  public readonly token?: string | null;

  public readonly updatedAt: Date;

  public readonly updatedBy?: string | null;
}
