import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/services/prisma.service';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';
import { CreateOneUrlController } from '@modules/url/controllers/create-one-url.controller';
import { GetOneUrlByIdController } from '@modules/url/controllers/get-one-url-by-id.controller';
import { GetManyUrlController } from '@modules/url/controllers/get-many-url.controller';
import { UpdateOneUrlByIdController } from '@modules/url/controllers/update-one-url-by-id.controller';
import { SoftDeleteOneUrlByIdController } from '@modules/url/controllers/soft-delete-one-url-by-id.controller';
import { HardDeleteOneUrlByIdController } from '@modules/url/controllers/hard-delete-one-url-by-id.controller';
import { CreateOneUrlService } from '@modules/url/services/create-one-url.service';
import { GetManyUrlService } from '@modules/url/services/get-many-url.service';
import { GetOneUrlByIdService } from '@modules/url/services/get-one-url-by-id.service';
import { UpdateOneUrlByIdService } from '@modules/url/services/update-one-url-by-id.service';
import { SoftDeleteOneUrlByIdService } from '@modules/url/services/soft-delete-one-url-by-id.service';
import { HardDeleteOneUrlByIdService } from '@modules/url/services/hard-delete-one-url-by-id.service';

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
