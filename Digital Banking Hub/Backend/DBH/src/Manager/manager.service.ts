import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Authentication } from 'src/Authentication/Authentication.entity';
import { Users } from 'src/CommonEntities/Users.entity';

@Injectable()
export class ManagerService {
    constructor(
        @InjectRepository(Authentication) private authenticationRepository: Repository<Authentication>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) { }
}
