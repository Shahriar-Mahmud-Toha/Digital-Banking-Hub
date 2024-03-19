import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AdminModule} from './Administrator/admin.module';
import { UsersModule } from './Employee/Users.module';

@Module({
  imports: [AdminModule, UsersModule, TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'DBH',
    autoLoadEntities: true,
    synchronize: true,
    } ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
