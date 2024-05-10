import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './managerAuthconstants';
import { managerAuthService } from './managerAuth.service';
import { managerAuthController } from './managerAuth.controller';
import { ManagerModule } from '../manager.module';

@Module({
  imports: [
    ManagerModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [managerAuthService],
  controllers: [managerAuthController],
  exports: [managerAuthService],
})
export class managerAuthModule {}