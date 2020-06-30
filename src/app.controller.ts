import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async getWebhook(@Body() msg, @Headers() headers) {
    console.log('=== msg ===', typeof msg, msg);

    console.log('=== headers ===', typeof headers, headers)
    
    return this.appService.sendMsg(msg)
  }
}
