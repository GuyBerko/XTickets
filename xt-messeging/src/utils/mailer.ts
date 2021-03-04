import client from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';

export enum EmailSubjects {
  'OrderComplete' = 'Order Complete',
  'OrderRemainder' = 'Order Remainder',
  'UserCreated' = 'User Created',
}

export enum EmailTemplates {
  'OrderComplete' = 'd-41df4607c7784b2c9d453bb5de030351',
  'OrderRemainder' = 'd-470312673ee44f7ea5131fb65e5cd6fd',
  'UserCreated' = 'd-9b6de8b4380147338534ace60dcefd28',
}

interface OrderCompleteParams {
  orderId: string;
  eventName: string;
  eventDesc: string;
  eventDate: string;
  price: string;
  priceWithoutTax: string;
  tax: string;
  totalPrice: string;
  orderDate: string;
  quantity: number;
  email: string;
  name: string;
}

interface OrderRemainderParams {
  orderId: string;
  eventName: string;
  eventDesc: string;
  eventDate: string;
  price: string;
  priceWithoutTax: string;
  tax: string;
  totalPrice: string;
  orderDate: string;
  quantity: number;
  email: string;
  name: string;
}

interface UserCreatedParams {
  name: string;
}

type TemplateParamsTypes =
  | OrderCompleteParams
  | UserCreatedParams
  | OrderRemainderParams;

export class Mailer {
  //constants
  private _fromEmail: string = 'xtickets@guy-berkovich.com';
  private _fromName: string = 'XTickets';
  private _toEmail: string = '';
  private _toName: string = '';
  private _subject: EmailSubjects;
  private _emailTemplate: EmailTemplates;
  private _templateParams: TemplateParamsTypes;

  constructor(
    toEmail: string,
    toName: string,
    subject: EmailSubjects,
    template: EmailTemplates,
    params: TemplateParamsTypes,
    fromEmail?: string,
    fromName?: string
  ) {
    this._toEmail = toEmail;
    this._toName = toName;
    this._subject = subject;
    this._emailTemplate = template;
    this._templateParams = params;
    this._fromEmail = fromEmail || this._fromEmail;
    this._fromName = fromName || this._fromName;
  }

  send(): Promise<[ClientResponse, {}]> {
    if (!this._toEmail) {
      throw new Error('[Mailer] - toEmail must be initialized');
    }

    if (!this._toName) {
      throw new Error('[Mailer] - toName must be initialized');
    }

    return client.send({
      to: {
        email: this._toEmail,
        name: this._toName,
      },
      from: {
        email: this._fromEmail,
        name: this._fromName,
      },
      subject: this._subject,
      templateId: this._emailTemplate,
      dynamicTemplateData: this._templateParams,
    });
  }
}
