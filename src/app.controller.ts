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
    const type = headers['x-github-event']
    
    return this.appService.formatMsg(msg, type)
  }
}
