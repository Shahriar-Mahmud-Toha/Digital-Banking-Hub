import { Body, Controller, HttpException, HttpStatus, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import * as bcrypt from 'bcrypt';
import { RegistrationUserDto } from "../dtos/user.dto";
import { AuthService } from "./auth.service";
import { loginDTO } from "../dtos/user.logIn.dto";
//import session, { Session } from "express-session";
import { Session } from '@nestjs/common';



@Controller('auth')
export class AuthController{

    constructor(private readonly authService:AuthService){}
    
  @Post('/createAccount')

  @UseInterceptors(FilesInterceptor('myFiles', 2, {
    fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
            cb(null, true);
        else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
    },
    limits: { fileSize: 300000000 },
    storage: diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        },
    })
}))
    

@UsePipes(new ValidationPipe)
async createAccount(@Body() myobj: RegistrationUserDto, @UploadedFiles() myFiles: Express.Multer.File[]): Promise<RegistrationUserDto | string> {
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(myobj.password, salt);
    myobj.password = hashedpassword;

    if (myFiles.length !== 2) {
       
        throw new Error('Please upload exactly two files');
    }

    myobj.filename = myFiles[0].filename; // First file
    myobj.nomineeFilename = myFiles[1].filename; // Second file (nominee file)

  return this.authService.createAccount(myobj);
}


@Post('/login')
async signIn(@Body() logindata: loginDTO, @Session() session) {
  try {
  
    const userId = await this.authService.findUid(logindata);
    if (!userId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    session.email = logindata.email;
    session.userid = userId;
    return await this.authService.signIn(logindata);
  } catch (error) {
  
    if (error instanceof HttpException) {
      
      throw error;
    } else {
     
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}



    

}