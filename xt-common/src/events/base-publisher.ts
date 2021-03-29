import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

/**
 * Describe the interface of a message bus event.
 */
interface Event {
  subject: Subjects;
  data: any;
}

/**
 * Abstract implementation for nats-streaming server (aka the message bus) publisher.
 */
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  /**
   * Get an event data and publish it to all listener according to the event subject
   * @param data - the event data
   * @returns a promise that resolve with undefined is there was no errors or reject with an error message
   */
  publish(data: T['data']): Promise<void> {
    return new Promise((res, rej) => {
      try {
        var parsedData = JSON.stringify(data);
      } catch (err) {
        return rej(`[Publisher][${this.subject}] - data is not a valid json`);
      }
      this.client.publish(this.subject, parsedData, (err) => {
        if (err) {
          return rej(err);
        }

        res();
      });
    });
  }
}
