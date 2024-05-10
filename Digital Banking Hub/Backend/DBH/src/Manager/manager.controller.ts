import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { JwtService } from '@nestjs/jwt';
import { ManagerDetails } from './DTOs/ManagerDetails.dto';
import { randomBytes } from 'crypto';
import { extname, join } from 'path';
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import { managerAuthGuard } from './Auth/managerAuth.guard';

const tempFolder = './uploads/manager/temp';
const storageFolder = './uploads/manager/storage';

@Controller('/manager')
export class ManagerController {
  constructor(
    private readonly managerService: ManagerService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/provideDetails')
  @UseGuards(managerAuthGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|png|jpeg)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 500000 }, // 4 megabit
      storage: diskStorage({
        destination: tempFolder,
        filename: function (req, file, cb) {
          const randomBytesBuffer = randomBytes(4);
          let ranNum =
            parseInt(randomBytesBuffer.toString('hex'), 16) % 100000000; ////8 digit -> 10e8
          const extension = extname(file.originalname);
          cb(null, Date.now() + ranNum.toString() + extension);
        },
      }),
    }),
  )
  async insertManagerDetails(
    @Body() data: ManagerDetails,
    @UploadedFile() picture: Express.Multer.File,
  ): Promise<Object> {
    try {
      const result =
        await this.managerService.findVerifiedManagerByEmailForAuth(data.Email);
      if (result == null) {
        throw new BadRequestException(
          'No Manager found associated with this email.',
        );
      }

      const user = await this.managerService.findManagerDetailsByEmail(
        data.Email,
      );
      if (user != false) {
        throw new BadRequestException('Manager Details already exist.');
      }

      if (
        await this.managerService.insertManagerDetails(data, picture.filename)
      ) {
        const sourcePath = join(tempFolder, picture.filename);
        const destinationPath = join(storageFolder, picture.filename);
        if (!existsSync(storageFolder)) {
          mkdirSync(storageFolder, { recursive: true });
        }
        renameSync(sourcePath, destinationPath);

        return {
          message: 'Account Details Added Successfully.',
        };
      } else {
        throw new InternalServerErrorException(
          'Database Operation for Account Details Insertion is Failed.',
        );
      }
    } catch (error) {
      // Delete the file if insertion fails
      await this.deleteTempPicture(picture.filename);
      throw error;
    }
  }
  async deleteTempPicture(filename: string): Promise<boolean> {
    const filePath = join(tempFolder, filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  }

}
