import {
  Publisher,
  OrderCreatedEvent,
  OrderCancelledEvent,
  Subjects,
} from '@gb-xtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
