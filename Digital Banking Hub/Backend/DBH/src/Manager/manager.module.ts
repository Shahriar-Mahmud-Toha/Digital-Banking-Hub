import { Module } from '@nestjs/common';
import { Authentication } from 'src/Authentication/auth.entity';
import { Users } from 'src/CommonEntities/Users.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from 'src/Administrator/admin.module';

@Module({
  imports: [AdminModule, TypeOrmModule.forFeature([Authentication, Users]),],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
