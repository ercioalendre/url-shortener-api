import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/services';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
