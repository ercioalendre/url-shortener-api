export class DeleteOneUserOutputDto {
  public readonly id: string;
  public readonly fullName: string;
  public readonly createdAt: Date;
  public readonly createdBy?: string | null;
}
