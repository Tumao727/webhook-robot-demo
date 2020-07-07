import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Param,
} from '@nestjs/common';
import { IParam, IHeader, Type, IRes } from './github.interfaces';
import { GithubService } from './github.service';
import { GitHubEventsGuard } from './github-event.guard';
import { GithubWebhookEvents, GithubWebhookActions } from './github.decorator';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  // github webhook example: api_url/:robot_key/:secret_key

  @UseGuards(GitHubEventsGuard)
  @GithubWebhookEvents(['issues', 'pull_request'])
  @GithubWebhookActions(['opened', 'closed'])
  @Post(':robotToken/:secretToken')
  async getWebhook(
    @Body() params: IParam,
    @Headers() headers: IHeader,
    @Param('robotToken') robotToken: string,
  ): Promise<IRes> {
    const type: Type = headers['x-github-event'];

    return this.githubService.sendMsg(params, type, robotToken);
  }
}
