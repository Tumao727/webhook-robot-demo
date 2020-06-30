import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async getWebhook(@Body() msg) {
    console.log('msg', typeof msg, msg);

    return 'success'
    
    // return this.appService.sendMsg(msg)
  }
}
