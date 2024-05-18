import { Controller, Get ,Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/hello')
  getMyHello(): string {
    return this.appService.getMyHello();
  }

  @Get('/DemoHello')
  getDemoHello(): object {
    return this.appService.getDemoHello();
  }

  @Post('/add')
  addme(): object {
    return {message:'Post Method'}
  }
}
