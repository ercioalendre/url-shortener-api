import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RolesGuard } from '@guards';
import { AppCrypto } from '@utilities/app-crypto';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@modules/database/database.module';
import { UrlModule } from '@modules/url/url.module';
import { RedirectionModule } from '@modules/redirection/redirection.module';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { AppConfig } from '@config';
import { HealthCheckModule } from '@modules/health-check/health-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GracefulShutdownModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow('RATE_LIMITING_TTL'),
          limit: configService.getOrThrow('RATE_LIMITING_LIMIT'),
        },
      ],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    UrlModule,
    RedirectionModule,
    HealthCheckModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppConfig,
    AppCrypto,
  ],
  controllers: [],
})
export class AppModule {}
