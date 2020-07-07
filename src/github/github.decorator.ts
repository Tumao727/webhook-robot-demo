import { SetMetadata } from '@nestjs/common';
import { Type, ActionType } from './github.interfaces';

export const GithubWebhookEvents = (events: Type[]): any => {
  return SetMetadata('GithubWebhookEvents', events);
};

export const GithubWebhookActions = (actions: ActionType[]): any => {
  return SetMetadata('GithubWebhookActions', actions);
};
