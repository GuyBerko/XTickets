import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@gb-xtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
