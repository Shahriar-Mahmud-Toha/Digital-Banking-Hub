import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ObjectEncodingOptions } from 'fs';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
