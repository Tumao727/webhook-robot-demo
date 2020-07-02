import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { IParam, IHeader, Type } from './app.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getWebhook(@Body() params: IParam, @Headers() headers: IHeader) {
    const type: Type = headers['x-github-event']
    
    return this.appService.sendMsg(params, type)
  }
}
