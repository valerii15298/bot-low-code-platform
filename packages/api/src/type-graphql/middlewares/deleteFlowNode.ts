import { Injectable } from '@nestjs/common';
import {
  MiddlewareInterface,
  NextFn,
  PubSub,
  PubSubEngine,
  ResolverData,
} from 'type-graphql';

@Injectable()
export class DeleteFlowNode implements MiddlewareInterface {
  constructor(@PubSub() private pubSub: PubSubEngine) {}

  async use({ args }: ResolverData, next: NextFn): Promise<any> {
    return next();
  }
}
