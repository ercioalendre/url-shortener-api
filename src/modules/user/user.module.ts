import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { AppCrypto } from '@utilities/app-crypto';
import { CreateOneUserController } from '@modules/user/controllers/create-one-user.controller';
import { GetOneUserByIdController } from '@modules/user/controllers/get-one-user-by-id.controller';
import { GetManyUserController } from '@modules/user/controllers/get-many-user.controller';
import { UpdateOneUserByIdController } from '@modules/user/controllers/update-one-user-by-id.controller';
import { SoftDeleteOneUserByIdController } from '@modules/user/controllers/soft-delete-one-user-by-id.controller';
import { HardDeleteOneUserByIdController } from '@modules/user/controllers/hard-delete-one-user-by-id.controller';
import { CreateOneUserService } from '@modules/user/services/create-one-user.service';
import { GetManyUserService } from '@modules/user/services/get-many-user.service';
import { GetOneUserByIdService } from '@modules/user/services/get-one-user-by-id.service';
import { UpdateOneUserByIdService } from '@modules/user/services/update-one-user-by-id.service';
import { SoftDeleteOneUserByIdService } from '@modules/user/services/soft-delete-one-user-by-id.service';
import { HardDeleteOneUserByIdService } from '@modules/user/services/hard-delete-one-user-by-id.service';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';

@Module({
  controllers: [
    CreateOneUserController,
    GetManyUserController,
    GetOneUserByIdController,
    UpdateOneUserByIdController,
    SoftDeleteOneUserByIdController,
    HardDeleteOneUserByIdController,
  ],
  providers: [
    CreateOneUserService,
    GetManyUserService,
    GetOneUserByIdService,
    UpdateOneUserByIdService,
    SoftDeleteOneUserByIdService,
    HardDeleteOneUserByIdService,
    UserPrismaRepository,
    UrlPrismaRepository,
    PrismaService,
    AppCrypto,
  ],
  exports: [UserPrismaRepository, UrlPrismaRepository],
})
export class UserModule {}
