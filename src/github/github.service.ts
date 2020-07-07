import { Injectable, HttpService } from '@nestjs/common';
import {
  IParam,
  Type,
  IMessageInfo,
  IRepository,
  IUser,
  IRes,
} from './github.interfaces';
import { map } from 'rxjs/operators';

@Injectable()
export class GithubService {
  constructor(private httpService: HttpService) {}

  private async _requestSendMsgToChatbot(
    data: IMessageInfo,
    robotToken: string,
  ): Promise<IRes> {
    return this.httpService
      .post(
        `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${robotToken}`,
        data,
      )
      .pipe(
        map(res => {
          if (res.data.errcode !== 0) {
            throw new Error(res.data.errmsg);
          }
          return res.data;
        }),
      )
      .toPromise();
  }

  private _getCommonContent(
    repo: IRepository,
    sender: IUser,
    action: string,
    assignee: IUser,
  ): string {
    const content = `Repository Detail: ${
      repo.html_url
    }\nAction: ${action}\nSender: ${sender.login}\nAssignee: ${(assignee &&
      assignee.login) ||
      '--'}`;

    return content;
  }

  private _formatIssueContent(param: IParam): string {
    const { repository, issue, sender, action } = param;

    const content = `Issue Change\n\nIssue Detail: ${
      issue.url
    }\n${this._getCommonContent(repository, sender, action, issue.assignee)}`;

    return content;
  }

  private _formatPrContent(param: IParam): string {
    const { repository, pull_request, sender, action } = param;

    const content = `Pull Request Change\n\nPR Title: ${
      pull_request.title
    }\nPR Detail: ${pull_request.html_url}\n${this._getCommonContent(
      repository,
      sender,
      action,
      pull_request.assignee,
    )}`;

    return content;
  }

  private _formatPrReviewContent(param: IParam): string {
    const { repository, pull_request, sender, action, review } = param;

    const content = `Pull Request Review Change\n\nPR Detail: ${
      pull_request.html_url
    }\nReview Detail: ${review.html_url}\n${this._getCommonContent(
      repository,
      sender,
      action,
      pull_request.assignee,
    )}`;

    return content;
  }

  public async sendMsg(
    param: IParam,
    type: Type,
    robotToken: string,
  ): Promise<IRes> {
    const funcMapToGetContent = {
      issues: this._formatIssueContent.bind(this),
      pull_request: this._formatPrContent.bind(this),
      pull_request_review: this._formatPrReviewContent.bind(this),
    };

    const msg: IMessageInfo = {
      msgtype: 'text',
      text: {
        content: `${funcMapToGetContent[type](param)}`,
      },
    };

    try {
      return await this._requestSendMsgToChatbot(msg, robotToken);
    } catch (err) {
      throw err;
    }
  }
}
