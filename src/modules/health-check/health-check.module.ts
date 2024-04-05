import { Module } from '@nestjs/common';
import { HealthCheckController } from '@modules/health-check/controllers';

@Module({
  controllers: [HealthCheckController],
  providers: [],
  imports: [],
  exports: [],
})
export class HealthCheckModule {}
