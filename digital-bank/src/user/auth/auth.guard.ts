import {
    CanActivate,ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { secret } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
      //  console.log(request);
        if (!token) {
            throw new UnauthorizedException("Enter your token first");
        }
        try {
            // const payload = await verifyToken(token);
            // console.log('Token payload:', payload);  
            const payload = await this.jwtService.verifyAsync(
                token,
                
                secret.secret
                

            );
            request['user'] = payload;
         //   console.log(request['user']);
            //console.log(payload);
          

         } catch {
             throw new UnauthorizedException("Please Log in first");
          }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ?  token:undefined ;
    }
}

// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(private jwtService: JwtService) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const token = this.extractTokenFromHeader(request);

//         if (!token) {
//             throw new UnauthorizedException('Unauthorized. Token not provided.');
//         }

//         try {
//             const payload = await this.jwtService.verifyAsync(token, {
//                 secret: jwtConstants.secret
//             });



//             request.user = payload;
//             return true;
//         } catch (error) {
//             throw new UnauthorizedException('Unauthorized. Invalid token.');
//         }
//     }

//     private extractTokenFromHeader(request: Request): string | undefined {
//         const authorizationHeader = request.headers.authorization;
        
//         if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
//             return authorizationHeader.substring(7); // Remove 'Bearer ' prefix
//         }
        
//         return undefined;
//     }
// }
