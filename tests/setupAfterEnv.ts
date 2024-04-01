import { DatabaseModule } from '@modules/database/database.module';
import { UserPrismaRepository } from '@modules/user/repositories/user.prisma.repository';
import { CreateOneUserService } from '@modules/user/services/create-one-user.service';
import { SoftDeleteOneUserByIdService } from '@modules/user/services/soft-delete-one-user-by-id.service';
import { HardDeleteOneUserByIdService } from '@modules/user/services/hard-delete-one-user-by-id.service';
import { GetManyUserService } from '@modules/user/services/get-many-user.service';
import { GetOneUserByIdService } from '@modules/user/services/get-one-user-by-id.service';
import { UpdateOneUserByIdService } from '@modules/user/services/update-one-user-by-id.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppCrypto } from '@utilities/app-crypto';
import { UrlPrismaRepository } from '@modules/url/repositories/url.prisma.repository';

beforeAll(async () => {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [DatabaseModule, ConfigModule.forRoot()],
    providers: [
      CreateOneUserService,
      SoftDeleteOneUserByIdService,
      HardDeleteOneUserByIdService,
      GetOneUserByIdService,
      GetManyUserService,
      UpdateOneUserByIdService,
      UserPrismaRepository,
      UrlPrismaRepository,
      AppCrypto,
    ],
  }).compile();

  global.testingModule = testingModule;
});
