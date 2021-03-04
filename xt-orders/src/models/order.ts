import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@gb-xtickets/common';
import { TicketDoc } from './ticket';

// An interface that describe the properties
// that are required to create a new order
interface OrderAttrs {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
  quantity: number;
}

// An interface that describe the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describe the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
  version: number;
  createdAt: Date;
  tax: number;
  quantity: number;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    tax: {
      type: Number,
      default: 0.17,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.set('timestamps', true);
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
