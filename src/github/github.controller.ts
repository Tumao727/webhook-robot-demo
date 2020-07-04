import { Controller, Post, Body, Headers } from '@nestjs/common';
import { IParam, IHeader, Type, IRes } from './github.interfaces';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {

  constructor(private readonly githubService: GithubService) {}

  @Post()
  async getWebhook(@Body() params: IParam, @Headers() headers: IHeader): Promise<IRes> {
    const type: Type = headers['x-github-event'];

    return this.githubService.sendMsg(params, type)
  }
}
