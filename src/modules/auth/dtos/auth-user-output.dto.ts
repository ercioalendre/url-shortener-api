import { AuthUserBaseDto } from '@modules/auth/dtos';

export abstract class AuthUserOutputDto extends AuthUserBaseDto {
  public readonly password?: string | null;
  public readonly token?: string | null;
}
