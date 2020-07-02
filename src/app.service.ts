import { Injectable, HttpService } from '@nestjs/common';
import { IParam, Type, IMessageInfo } from './app.interfaces';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  private async _requestSendMsgToChatbot(json) {
    return this.httpService.post(
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=97967658-62ad-4ee8-9df7-0096e2c60452',
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

  private _formatIssueContent(param: IParam): string {
    const {repository, issue, sender, action} = param

    const content: string = `
    Repository Name: ${repository.name}
    Repository Url: ${repository.html_url}
    Type: Issues
    Action: ${action}
    Issue Url: ${issue.url}
    Sender: ${sender.login}
    Assignee: ${issue.assignee && issue.assignee.login || '--'}
    `

    return content;
  }

  private _formatPrContent(param: IParam, type: Type): string {
    // const { } = param
    console.log('=== param ===', param, '--- type ---', type)

    const content: string = `

    `

    return content
  }


  public async sendMsg(param: IParam, type: Type) {
    console.log('type', type)
    const funcMapToGetContent = {
      issues: this._formatIssueContent,
      pull_request: this._formatPrContent,
    }

    const msg: IMessageInfo = {
      msgtype: 'text',
      text: {
        content: `Github Change Report\n${funcMapToGetContent[type](param, type)}`,
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
