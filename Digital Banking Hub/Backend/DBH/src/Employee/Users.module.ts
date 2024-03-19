import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from './Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),],
  controllers: [],
  providers: [],
})
export class UsersModule {}
