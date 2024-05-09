import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './Administrator/admin.module';
import { adminAuthModule } from './Administrator/Auth/adminAuth.module';
import { ManagerModule } from './Manager/manager.module';
import { EmployeeModule } from './Employee/employee.module';
import { AuthModule } from './Authentication/auth.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [AdminModule, ManagerModule,EmployeeModule,UserModule,TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'DBH',
    autoLoadEntities: true,
    synchronize: true,
    } ),
    adminAuthModule,AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
