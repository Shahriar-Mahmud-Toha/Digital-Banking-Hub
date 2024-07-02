import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Res, Session, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { UserService } from "./user.service";
import { RegistrationUserDto, profileDTO } from './UserDTO/user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../Authentication/auth.guard';
import { loginDTO } from '../DTO/login.dto';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../Employee/Entity/employee.entity';
import * as path from 'path';
import session from 'express-session';
import { transactionDto } from './UserDTO/user.transaction.dto';
import { TransactionEntity } from '../Employee/Entity/transaction.entity';
import { serviceDTO } from './UserDTO/user.service.dto';
import { Roles } from '../CustomDecorator/roles.decorator';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  // @UseGuards(AuthGuard)

  @Get()
  getUser(): string {
    return this.userService.getUser();
  }


  //--1 get profile
  //@UseGuards(AuthGuard)
  @Roles('User')
  @Get('/profile-picture/:userId')
  async getUserProfilePictureById(@Param('userId') userId: string, @Res() res, @Session() session) {
    const profilePicture = (await this.userService.getUserProfilePictureById(userId)).fileName;
    const name = (await this.userService.getUserProfilePictureById(userId)).name;

    res.sendFile(profilePicture, { root: './upload' });

  }

  @UseGuards(AuthGuard)
  @Get('/getusers/:email')
  getUsersByEmail(@Param('email') email: string): object {
    return this.userService.getUsersByEmail(email);
  }

  //--2 user account Info
  @UseGuards(AuthGuard)
  @Roles('User')
  @Get('/getProfileInfo')
  getUserProfile(@Session() session): object {
    if (session && session['userId']) {
      // Retrieve data from session
      const userId = session['userId']; // Access the 'email' property stored in the session
      console.log(userId);
      return this.userService.getProfile(userId);
    }
    throw new NotFoundException('No data in session');

  }

  //--3 user account info One to one using session
  @UseGuards(AuthGuard)
  @Roles('User')
  //session.userID;
  @Get('/getAll/')
  getUserProfileAllInfo(@Session() session): object {
    console.log(session.email);
    return this.userService.getUserProfileAllInfo(session.email);

  }


  //--4 deposit Money completed
  @UseGuards(AuthGuard)
  @Roles('User')
  @Patch('/deposit/')
  @UsePipes(new ValidationPipe())
  async deposit(@Body() myobj: transactionDto): Promise<{ balance: number, transaction: TransactionEntity }> {
    {
      try {

        return await this.userService.deposit(myobj);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new Error('Deposit failed');
      }
    }
  }


  ///--5 Withdraw
  @UseGuards(AuthGuard)
  @Roles('User')
  @Patch('/withdraw/')
  @UsePipes(new ValidationPipe())
  async withdraw(@Body() myobj: transactionDto): Promise<{ balance: number, transaction: TransactionEntity }> {
    {
      try {

        return await this.userService.withdraw(myobj);
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
  @Roles('User')
  @Get('info-and-transactions/:id')
  async getUserInfoAndTransactions(@Param('id') id: number): Promise<{ transactions: TransactionEntity[] }> {
    return this.userService.getUserInfoAndTransactions(id);
  }

  ///---7 Make service request
  @UseGuards(AuthGuard)
  @Roles('User')

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
  async makeRequest(@Session() session, @Body() myobj: serviceDTO, @UploadedFiles() myFiles: Array<Express.Multer.File>): Promise<serviceDTO | string> {
    if (!myFiles || myFiles.length === 0) {
      return 'No file uploaded';
    }

    // Assuming you want to handle the first uploaded file
    const firstFile = myFiles[0];

    if (!firstFile.filename) {
      return 'Uploaded file has no filename';
    }

    myobj.filename = firstFile.filename;
    console.log(myobj.filename);

    return this.userService.makeRequest(myobj, session);
  }



  //---8 Update User Profile Pic

  @UseGuards(AuthGuard)
  @Roles('User')
  @Post('/update-profile-picture')
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

    await this.userService.updateUserProfilePicture(session.userid, firstFile.filename);
    return { message: 'Profile picture updated successfully.' };
  }






  @UseGuards(AuthGuard)
  @Roles('User')
  @Delete('/delete-profile-picture')
  async deleteProfilePicture(@Session() session) {
    await this.userService.deleteUserProfilePicture(session.userid);
    return { message: 'Profile picture deleted successfully.' };
  }


  @Get('/getProfileInFo/:userID')
  getProfile(@Param('userID') userId: string) {
    return this.userService.getUserProfile(userId);
  }



  @Get('/getimage/:name')
  getImages(@Param('name') name: string, @Res() res) {
    res.sendFile(name, { root: './upload' })
  }




  @Get('/allusers')
  getAll(): object {
    return this.userService.getAllUsers();
  }



  @UseGuards(AuthGuard)
  @Get('/getAc')
  getUserAc(@Session() session): object {
    if (session && session['userId']) {
      // Retrieve data from session
      const userId = session['userId']; // Access the 'email' property stored in the session
      console.log(userId);
      return this.userService.getUserAc(userId);
    }
    throw new NotFoundException('No data in session');

  }








  @UseGuards(AuthGuard)
  @Get('/getAc/:userId')
  getUserAcc(@Param('userId') userId: string): object {


    return this.userService.getUserAc(userId);

  }




  @UseGuards(AuthGuard)

  @Put('/updateProfile/:email')

  updateProfile(@Param('email') email: string, @Body() myobj: profileDTO): Promise<profileDTO | string> {

    // Retrieve data from session

    return this.userService.updateProfile(email, myobj);
  }





  //@UseGuards(AuthGuard)









}









