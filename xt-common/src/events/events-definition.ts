import { Subjects } from './subjects';
import { OrderStatus, TicketCategory } from './types';

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    category: TicketCategory;
    description: string;
    date: Date;
    price: number;
    userId: string;
  };
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    category: TicketCategory;
    description: string;
    date: Date;
    userId: string;
    orderId?: string;
  };
}

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    quantity: number;
    expiresAt: string;
    userId: string;
    status: OrderStatus;
    createdAt: Date;
    tax: number;
    ticket: {
      price: number;
      id: string;
    };
  };
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    email: string;
    name: string;
    id: string;
  };
}
