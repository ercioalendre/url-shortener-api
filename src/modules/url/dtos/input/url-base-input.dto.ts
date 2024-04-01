import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export abstract class UrlBaseInputDto {
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Original URL.',
    example: 'https://www.google.com',
  })
  public originalUrl: string;
}
