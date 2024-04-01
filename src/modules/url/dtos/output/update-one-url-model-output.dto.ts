import { UrlModelBaseOutputDto } from './url-model-base-output.dto';

export abstract class UpdateOneUrlModelOutputDto extends UrlModelBaseOutputDto {
  public readonly token?: string | null;

  public readonly updatedAt: Date;

  public readonly updatedBy?: string | null;
}
