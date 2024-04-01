import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { AppCrypto } from '@utilities/app-crypto';
import { RedirectionController } from '@modules/redirection/controllers/redirection.controller';
import { RedirectionService } from '@modules/redirection/services/redirection.service';

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
