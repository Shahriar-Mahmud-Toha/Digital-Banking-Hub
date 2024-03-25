import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Res, Session, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { get } from 'http';
import { UserService } from "./user.service";
import { RegistrationUserDto} from './dtos/user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from './auth/auth.guard';
import { loginDTO } from './dtos/user.logIn.dto';
import { Repository } from 'typeorm';
import { UserRegistrationEntity } from './entitys/user.entity';
import * as path from 'path';
import session from 'express-session';
import { transactionDto } from './dtos/user.transaction.dto';
import { TransactionEntity } from './entitys/transaction.entity';
import { serviceDTO } from './dtos/user.service.dto';

@Controller('/user')
export class UserController {
    constructor(private readonly userService:UserService){}
  // @UseGuards(AuthGuard)
    
  @Get()
  getUser(): string{
    return this.userService.getUser();
  }

 
    


   //Get profile pic using user id
  // @UseGuards(AuthGuard)

  //--1 get profile
  @UseGuards(AuthGuard)
    @Get('/profile-picture/:userID')
    async getUserProfilePictureById(@Param('userID') userId: string, @Res() res  ,@Session() session) {
        const profilePicture = (await this.userService.getUserProfilePictureById(userId)).fileName;
        const name = (await this.userService.getUserProfilePictureById(userId)).name;
    
        res.sendFile(profilePicture, { root: './upload' });
       
    }


   
    //--2 user account Info
    @Get('/getProfileInfo/')
    getUserProfile(@Session() session):object{
      return this.userService.getUserProfile(session.userid);
    }

    //--3 user account info One to one using session
    @UseGuards(AuthGuard)
     //session.userID;
    @Get('/getAll/')
    getUserProfileAllInfo(@Session() session):object{
      console.log(session.userid);
      return this.userService.getUserProfileAllInfo(session.userid);
      
    }


     //--4 deposit Money completed
    @UseGuards(AuthGuard)
   @Patch('/deposit/')
   @UsePipes(new ValidationPipe())
   async deposit(@Body() myobj: transactionDto ): Promise<{ balance: number, transaction: TransactionEntity }>{ {
    try {
      
       return await this.userService.deposit( myobj);
     } catch (error) {
       if (error instanceof NotFoundException) {
         throw error;
       }
       throw new Error('Withdrawal failed');
     }
   }
   }

   
///--5 Withdraw
  @UseGuards(AuthGuard)

   @Patch('/withdraw/')
@UsePipes(new ValidationPipe())
async withdraw( @Body() myobj: transactionDto): Promise<{ balance: number, transaction: TransactionEntity }>{ {
 try {
   
    return await this.userService.withdraw( myobj);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new Error('Withdrawal failed');
  }
}
}

///--6 TransectionHistor  many

@UseGuards(AuthGuard)
  @Get('info-and-transactions/')
  async getUserInfoAndTransactions(@Session() session): Promise<{ user: UserRegistrationEntity, transactions: TransactionEntity[] }> {
    return this.userService.getUserInfoAndTransactions(session.userid);
  }


  ///---7 Make service request

  
  @Post('makeServiceRequest')
  @UseInterceptors(FilesInterceptor('myFiles', 1, {
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
  async makeRequest(@Session() session,@Body() myobj: serviceDTO, @UploadedFiles() myFiles: Array<Express.Multer.File>): Promise<serviceDTO | string> {
    if (!myFiles || myFiles.length === 0) {
        return 'No file uploaded';
    }

    // Assuming you want to handle the first uploaded file
    const firstFile = myFiles[0];

    if (!firstFile.filename) {
        return 'Uploaded file has no filename';
    }

    myobj.filename = firstFile.filename;
   // console.log(myobj.filename);

    return this.userService.makeRequest(myobj,session);
}



//---8 Update User Profile Pic


@Post('/update-profile-picture')
@UseGuards(AuthGuard)
@UseInterceptors(FilesInterceptor('myFiles', 1, {
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
async updateProfilePicture(@Session() session, @UploadedFiles() myFiles: Array<Express.Multer.File>) {
  const firstFile = myFiles[0];
  // Assuming the user ID is stored in the request by the AuthGuard
  
  await this.userService.updateUserProfilePicture(session.userid,firstFile.filename);
  return { message: 'Profile picture updated successfully.' };
}




    
  ////Experiment

  // @Get('/transactions/:userId')
  // async getUserTransactions(@Param('userId') userId: string): Promise<TransactionEntity[]> {
  //   return this.userService.getUserTransactions(userId);
  // }


 //sendmail

    // @Post('/sendMail')
    // sendMail(){
    //     return this.mailerService.sendmail;

    // }


    @Delete('/delete-profile-picture')
    @UseGuards(AuthGuard)
    async deleteProfilePicture(@Session() session) {
      await this.userService.deleteUserProfilePicture(session.userid);
      return { message: 'Profile picture deleted successfully.' };
    }






}


  
    





