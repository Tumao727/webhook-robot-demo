import { Injectable, HttpService } from '@nestjs/common';
import { IParam, Type, IMessageInfo, IRepository, IUser, IRes } from './github.interfaces';
import { map } from 'rxjs/operators';

@Injectable()
export class GithubService {
  constructor(private httpService: HttpService) {}

  private async _requestSendMsgToChatbot(json): Promise<IRes> {
    return this.httpService.post(
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=97967658-62ad-4ee8-9df7-0096e2c60452',
      // `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${process.env.WECHAT_GITHUB_ROBOT_KEY}`,
      json,
    )
    .pipe(map(res => {
      if (res.data.errcode !== 0) {
        throw new Error(res.data.errmsg)
      }
      return res.data
    }))
    .toPromise()
  }

  private _getCommonContent(repo: IRepository, sender: IUser, action: string, assignee: IUser): string {
    const content =
     `Repository Detail: ${repo.html_url}
      Action: ${action}
      Sender: ${sender.login}
      Assignee: ${assignee && assignee.login || '--'}
    `

    return content
  }

  private _formatIssueContent(param: IParam): string {
    const {repository, issue, sender, action} = param

    const content = `
      Type: Issue
      Issue Detail: ${issue.url}
      ${this._getCommonContent(repository, sender, action, issue.assignee)}
    `

    return content;
  }

  private _formatPrContent(param: IParam): string {
    const {repository, pull_request, sender, action} = param

    const content = `
      Type: Pull Request
      PR Title: ${pull_request.title}
      PR Detail: ${pull_request.html_url}
      ${this._getCommonContent(repository, sender, action, pull_request.assignee)}
    `

    return content
  }

  private _formatPrReviewContent(param: IParam): string {
    const {repository, pull_request, sender, action, review} = param;

    const content = `
      Type: Pull Request Review
      PR Detail: ${pull_request.html_url}
      Review Detail: ${review.html_url}
      ${this._getCommonContent(repository, sender, action, pull_request.assignee)}
    `

    return content
  }

  public async sendMsg(param: IParam, type: Type): Promise<IRes> {
    
    const funcMapToGetContent = {
      issues: this._formatIssueContent.bind(this),
      pull_request: this._formatPrContent.bind(this),
      pull_request_review: this._formatPrReviewContent.bind(this),
    }

    const msg: IMessageInfo = {
      msgtype: 'text',
      text: {
        content: `Github Change Report\n${funcMapToGetContent[type](param)}`,
        mentioned_list: ['@all']
      },
    }

    try {
      return await this._requestSendMsgToChatbot(msg)
    } catch (err) {
      throw err
    }

  }
}
