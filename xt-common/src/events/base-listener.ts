import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

/**
 * Describe the interface of a message bus event.
 */
interface Event {
  subject: Subjects;
  data: any;
}

/**
 * Abstract implementation for nats-streaming server (aka the message bus) listener.
 */
export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  protected client: Stan;
  protected ackWait: number = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  /**
   * The function that will be called when a message recived.
   * @param data - the message parsed data
   * @param msg - the nats-streaming message instance
   */
  abstract onMessage(data: T['data'], msg: Message): void;

  /**
   * @returns a nats-streaming client SubscriptionOptions initialized to defaults
   */
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  /**
   * Subscribe to the event bus chanel according to the listener subject and queue group.
   * Also initialized the on message listener that get the message,
   * and pass it and it's parsed data to the onMessage function.
   */
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  /**
   * Get a message instance and return the parsed message data
   * @param msg - the nats-streaming message instance
   * @returns the message data after parsing to js object
   */
  parseMessage(msg: Message) {
    const data = msg.getData();

    return JSON.parse(typeof data === 'string' ? data : data.toString('utf8'));
  }
}
