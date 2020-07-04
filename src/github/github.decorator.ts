import { SetMetadata } from '@nestjs/common';
import { Type } from './github.interfaces';

export const GithubWebhookEvents = (events: Type[]): any => {
  return SetMetadata('GithubWebhookEvents', events)
}
