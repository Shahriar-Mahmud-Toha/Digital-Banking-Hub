import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerModule } from './Manager/manager.module';
import { AdminModule } from './Administrator/admin.module';
import { adminAuthModule } from './Administrator/Auth/adminAuth.module';

@Module({
  imports: [AdminModule, ManagerModule,TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'DBH',
    autoLoadEntities: true,
    synchronize: true,
    } ),
    adminAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
