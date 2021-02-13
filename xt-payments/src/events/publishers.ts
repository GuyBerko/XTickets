import { Publisher, PaymentCreatedEvent, Subjects } from '@gb-xtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
