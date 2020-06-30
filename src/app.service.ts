import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'original information';
  }

  sendMsg(param, type) {
    let testInfo = {
      msgtype: 'text',
      text: {
        content: '发送测试消息！！！',
        mentioned_list: ['@all'],
      },
    };

    if (type === 'issue') {
      testInfo.text.content = `${param.issue.user.login} 提了一个 issue (${param.issue.url}) 给 ${param.issue.assignee.login}`
    }

    const json = JSON.stringify(testInfo)
    return this.httpService.post(
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=97967658-62ad-4ee8-9df7-0096e2c60452',
      json
    );
  }
}
