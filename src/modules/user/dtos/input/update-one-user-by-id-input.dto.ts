import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { UserBaseInputDto } from '@modules/user/dtos/input';
import { IsJWT, IsOptional, IsString } from 'class-validator';

export class UpdateOneUserByIdInputDto extends PartialType(
  UserBaseInputDto as Type<UserBaseInputDto>,
) {
  @IsString()
  @IsOptional()
  @IsJWT()
  @ApiProperty({
    description: 'Token JWT.',
  })
  public readonly token?: string | null;
}
