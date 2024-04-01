export abstract class UserModelBaseInputDto {
  public id: string;
  public fullName: string;
  public email: string;
  public phone: string;
  public role: string;
  public password: string;
  public createdAt: Date;
  public createdBy: string;
}
