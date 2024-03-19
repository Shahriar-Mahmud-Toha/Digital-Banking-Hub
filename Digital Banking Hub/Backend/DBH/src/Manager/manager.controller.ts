import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { UseInterceptors, UploadedFile }
    from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from "multer";


@Controller('/admin')
export class ManagerController {
    constructor(private readonly managerService: ManagerService) { }
    
}