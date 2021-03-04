import { Publisher, UserCreatedEvent, Subjects } from '@gb-xtickets/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
