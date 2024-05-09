import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Authentication } from 'src/Authentication/auth.entity';
import { Users } from 'src/CommonEntities/Users.entity';
import { AdminService } from 'src/Administrator/admin.service';

@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Authentication) private authenticationRepository: Repository<Authentication>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        private readonly adminService: AdminService,
    ) { }
}
