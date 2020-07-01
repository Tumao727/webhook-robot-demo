import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'original information';
  }

  sendMsg(param, type) {
    const testInfo = {
      msgtype: 'text',
      text: {
        content: '发送测试消息！！！',
        mentioned_list: ['@all'],
      },
    };

    if (type === 'issues') {
      let text = ''
      switch (param.action) {
        case 'assigned':
          text = `${param.issue.user.login} 将 issue (${param.issue.url}) 指给了${param.issue.assignee.login}`;
          break;
        case 'closed':
          text = `${param.issue.user.login} 关闭了 issue (${param.issue.url})`
          break
        case 'reopened':
          text = `${param.issue.user.login} 重新打开了 issue (${param.issue.url})`;
          break;
        default:
          text = `${param.issue.user.login} 提了新 issue (${param.issue.url})`;
      }
      testInfo.text.content = text;
      
    }

    const json = JSON.stringify(testInfo)
    console.log('=== to see json ===', json)
    // return this.httpService.post(
    //   'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=97967658-62ad-4ee8-9df7-0096e2c60452',
    //   json
    // );
  }
}
