/**
 * Define all of the available message bus subjects
 */
export enum Subjects {
  // Tickets
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  // Orders
  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',

  // Expiration
  ExpirationComplete = 'expiration:complete',

  // Payments
  PaymentCreated = 'payment:created',

  // Users
  UserCreated = 'user:created',
}
