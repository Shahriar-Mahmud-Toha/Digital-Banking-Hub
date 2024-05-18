import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './Employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Authentication/auth.module';
import { UserModule } from './User/user.module';


@Module({
  imports: [EmployeeModule,UserModule,TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'DBMS',//Change to your database name
    autoLoadEntities: true,
    synchronize: true,
    } ),AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
