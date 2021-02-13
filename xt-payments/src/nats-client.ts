import nats, { Stan } from 'node-nats-streaming';

class NatsClient {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((res, rej) => {
      this.client.on('connect', () => {
        res('Connected to Nats');
      });
      this.client.on('error', (err) => {
        rej(err);
      });
    });
  }
}

export const natsClient = new NatsClient();
