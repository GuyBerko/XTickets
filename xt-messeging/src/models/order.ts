import mongoose from 'mongoose';
import { OrderStatus } from '@gb-xtickets/common';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { UserDoc } from './user';

// An interface that describe the properties
// that are required to create a new order
interface OrderAttrs {
  id: string;
  status: OrderStatus;
  user: UserDoc;
  ticket: TicketDoc;
  createdAt: Date;
  tax: number;
  quantity: number;
}

// An interface that describe the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describe the properties
// that a Order Document has
export interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  user: UserDoc;
  ticket: TicketDoc;
  version: number;
  id: string;
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
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
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
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    ...attrs,
  });

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
