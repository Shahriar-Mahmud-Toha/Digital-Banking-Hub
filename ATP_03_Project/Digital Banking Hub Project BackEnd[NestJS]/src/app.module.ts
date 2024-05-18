import { Module } from '@nestjs/common';
import { EmployeeModule } from './Employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Employee/auth/auth.module';


@Module({
  imports: [EmployeeModule,TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Tiger',
    database: 'DBHS',//Change to your database name
    autoLoadEntities: true,
    synchronize: true,
    } ),AuthModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
