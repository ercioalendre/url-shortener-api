import { AuthUserBaseDto } from '@modules/auth/dtos';

export abstract class AuthUserInputDto extends AuthUserBaseDto {
  public readonly token: string;
  public readonly password: string;
}
