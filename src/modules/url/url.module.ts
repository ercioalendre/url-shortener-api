import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/services';
import { UrlPrismaRepository } from '@modules/url/repositories';
import {
  CreateOneUrlController,
  GetOneUrlByIdController,
  GetManyUrlController,
  UpdateOneUrlByIdController,
  SoftDeleteOneUrlByIdController,
  HardDeleteOneUrlByIdController,
} from '@modules/url/controllers';
import {
  CreateOneUrlService,
  GetManyUrlService,
  GetOneUrlByIdService,
  UpdateOneUrlByIdService,
  SoftDeleteOneUrlByIdService,
  HardDeleteOneUrlByIdService,
} from '@modules/url/services';

@Module({
  controllers: [
    CreateOneUrlController,
    GetManyUrlController,
    GetOneUrlByIdController,
    UpdateOneUrlByIdController,
    SoftDeleteOneUrlByIdController,
    HardDeleteOneUrlByIdController,
  ],
  providers: [
    CreateOneUrlService,
    GetManyUrlService,
    GetOneUrlByIdService,
    UpdateOneUrlByIdService,
    SoftDeleteOneUrlByIdService,
    HardDeleteOneUrlByIdService,
    UrlPrismaRepository,
    PrismaService,
  ],
  exports: [UrlPrismaRepository],
})
export class UrlModule {}
