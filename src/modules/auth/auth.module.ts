import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppCrypto } from '@utilities/app-crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AppCrypto],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_AUTH_SECRET'),
        signOptions: {
          issuer: configService.getOrThrow<string>('APP_NAME'),
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
