import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UseInterceptors, UploadedFile }
    from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from "multer";


@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }
    
}