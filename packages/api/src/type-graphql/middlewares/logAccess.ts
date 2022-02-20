import { Injectable } from '@nestjs/common';
import {
  MiddlewareInterface,
  NextFn,
  PubSub,
  PubSubEngine,
  ResolverData,
} from 'type-graphql';
import { Context } from '../../app.module';

@Injectable()
export class LogAccess implements MiddlewareInterface {
  constructor(@PubSub() private pubSub: PubSubEngine) {}

  async use({ context }: ResolverData<Context>, next: NextFn): Promise<any> {
    return next();
  }
}
