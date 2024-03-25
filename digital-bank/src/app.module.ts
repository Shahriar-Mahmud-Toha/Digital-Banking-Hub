import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { RegistrationUserDto } from './user/dtos/user.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './user/auth/auth.service';
import { transactionDto } from './user/dtos/user.transaction.dto';
//import { AuthService } from './auth/auth.service';
//import { UserService } from './auth/user./user..service';


@Module({
  imports: [RegistrationUserDto,transactionDto,UserModule,TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'DBMS',//Change to your database name
    autoLoadEntities: true,
    synchronize: true,
    } )],
  controllers: [],
  providers: [],
})
export class AppModule {}
