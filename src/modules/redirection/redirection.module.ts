import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/services';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { AppCrypto } from '@utilities';
import { RedirectionController } from '@modules/redirection/controllers';
import { RedirectionService } from '@modules/redirection/services';

@Module({
  controllers: [RedirectionController],
  providers: [
    UrlPrismaRepository,
    PrismaService,
    AppCrypto,
    RedirectionService,
  ],
  exports: [UrlPrismaRepository],
})
export class RedirectionModule {}
