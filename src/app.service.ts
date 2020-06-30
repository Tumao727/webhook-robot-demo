import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'original information';
  }

  sendMsg(param) {
    // const testInfo = {
    //   msgtype: 'text',
    //   text: {
    //     content: `${param.issue.user.login} 提了一个 issue (${param.issue.url}) 给 ${param.issue.assignee.login}`,
    //     mentioned_list: ['@all'],
    //   },
    // };

    // const json = JSON.stringify(testInfo)
    console.log('param', param)
    // return this.httpService.post(
    //   'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=97967658-62ad-4ee8-9df7-0096e2c60452',
    //   json
    // );
  }
}
