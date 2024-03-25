import { Module } from "@nestjs/common";
import { UserModule } from "../user.module";
import { JwtModule } from "@nestjs/jwt";
import { secret } from "./constants";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
      UserModule,
      JwtModule.register({
        global: true,
        secret: secret,
        signOptions: { expiresIn: '30m' },
      }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
  })
  export class AuthModule {}