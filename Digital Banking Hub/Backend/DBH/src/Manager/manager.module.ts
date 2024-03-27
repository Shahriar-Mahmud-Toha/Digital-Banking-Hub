import { Module } from '@nestjs/common';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Users } from 'src/CommonEntities/Users.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { managerAuthService } from './Auth/managerAuth.service';
import { AdminService } from 'src/Administrator/admin.service';
import { AdminModule } from 'src/Administrator/admin.module';

@Module({
  imports: [AdminModule, TypeOrmModule.forFeature([Authentication, Users]),],
  controllers: [ManagerController],
  providers: [ManagerService, managerAuthService],
  exports: [ManagerService],
})
export class ManagerModule {}
