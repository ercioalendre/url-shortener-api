export abstract class UrlModelBaseInputDto {
  public id: string;
  public originalUrl: string;
  public shortenedPath: string;
  public views: number;
  public createdAt: Date;
}
