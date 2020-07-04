import { Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Type } from './github.interfaces';
import { createHmac } from 'crypto';

@Injectable()
export class GitHubEventsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const restrictedEvents = this.reflector.get<Type[]>(
      'GithubWebhookEvents',
      context.getHandler()
    )

    const request = context.switchToHttp().getRequest();
    
    const signature: string = request.headers['x-hub-signature'];
    const githubEvent: Type = request.headers['x-github-event'];

    return this._checkValid(signature, githubEvent, restrictedEvents, request.body)
  }

  private _checkValid(signature: string, githubEvent: Type, restrictedEvents: Type[], payload: any): boolean {
    if (!signature) {
      throw new UnauthorizedException(
        `This request doesn't contain a github signature`,
      );
    }

    if (!restrictedEvents.includes(githubEvent)) {
      throw new UnauthorizedException(
        `An unsupported webhook event was triggered`,
      )
    }

    return this._checkSignature(signature, payload);
  }

  private _checkSignature(signature: string, payload: any): boolean {
    const token: string = process.env.GITHUB_WEBHOOK_SECRET

    const hmac = createHmac('sha1', token)
    const digest = 'sha1=' + hmac.update(JSON.stringify(payload)).digest('hex');

    if (!token || signature !== digest) {
      throw new UnauthorizedException(
        `Request body digest (${digest}) does not match ${signature}`,
      );
    }


    return true;
  }
}