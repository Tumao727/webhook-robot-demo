import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { IParam, IHeader, Type, IRes } from './github.interfaces';
import { GithubService } from './github.service';
import { GitHubEventsGuard } from './github-event.guard';
import { GithubWebhookEvents } from './github.decorator';

@Controller('github')

export class GithubController {

  constructor(private readonly githubService: GithubService) {}

  @UseGuards(GitHubEventsGuard)
  @GithubWebhookEvents(['issues'])
  @Post()
  async getWebhook(@Body() params: IParam, @Headers() headers: IHeader): Promise<IRes> {
    const type: Type = headers['x-github-event'];

    return this.githubService.sendMsg(params, type)
  }
}
