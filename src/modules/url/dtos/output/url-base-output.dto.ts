export abstract class UrlBaseOutputDto {
  public id: string;
  public originalUrl: string;
  public shortenedPath: string;
  public shortenedUrl?: string | null;
  public views: number;
  public createdAt: Date;
  public createdBy?: string | null;
  public updatedAt?: Date | null;
  public updatedBy?: string | null;
  public softDeletedAt?: Date | null;
  public softDeletedBy?: string | null;
}
