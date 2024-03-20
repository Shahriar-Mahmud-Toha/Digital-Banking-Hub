import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UseInterceptors, UploadedFile }
    from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from "multer";


@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }
    
    //#region : Role
    @Post("/role/create")
    @UsePipes(new ValidationPipe)
    async CreateRole(@Body() data: Object): Promise<Object> {
        return {
            message:"Role Created Successfully",
            RoleID: await this.adminService.CreateRole(data["Name"])
        }
    }
    @Patch("/role/update/:id")
    @UsePipes(new ValidationPipe)
    async UpdateRole(@Param("id") id: string, @Body() data): Promise<Object> {
        let res = await this.adminService.updateRole(id,data["Name"]);
        if(!res){
            return {
                message:"Role Not Updated.",
            }
        }
        else{
            return {
                message:"Role Updated Successfully.",
            }
        }
    }

    @Delete("/role/delete/:id")
    @UsePipes(new ValidationPipe)
    async DeleteRole(@Param("id") id: string): Promise<Object> {
        let res = await this.adminService.deleteRole(id);
        if(!res){
            return {
                message:"This Role Cannot be Deleted.",
            }
        }
        else{
            return {
                message:"Role Deleted Successfully.",
            }
        }
    }
    @Get("/role/getall")
    @UsePipes(new ValidationPipe)
    async GetAllRoles(): Promise<Object> {
        return {
            message:"Operation Successful",
            data: await this.adminService.getAllRoles()
        }
    }
    //#endregion : Role
}