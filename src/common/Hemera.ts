// tslint:disable no-submodule-imports

import * as Nats from 'nats';
import * as Hemera from 'nats-hemera';
import { Observable } from 'rxjs';

import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { ERROR_EVENT, NATS_DEFAULT_URL } from '@nestjs/microservices/constants';
import { Client } from '@nestjs/microservices/external/nats-client.interface';

export interface HemeraOptions {
  hemera: Hemera.Config;
  nats: Nats.ClientOpts;
}

let natsPackage: any = {};

export class HemeraTransport extends Server implements CustomTransportStrategy {
  private hemeraClient: Hemera<{}, {}>;
  private natsClient: Client;
  private readonly url: string;

  constructor(private readonly options: HemeraOptions) {
    super();
    this.url = options.nats.url || NATS_DEFAULT_URL;
    natsPackage = this.loadPackage('nats', HemeraTransport.name, () =>
      require('nats'),
    );
    this.natsClient = this.createNatsClient();
    this.hemeraClient = this.createHemeraClient();
  }

  bindEvents(client: Hemera<{}, {}>) {
    const registeredPatterns = [...this.messageHandlers.keys()];
    registeredPatterns.forEach(pattern => {
      client.add(JSON.parse(pattern), async req =>
        this.handleMessage(pattern, req),
      );
    });
  }

  close() {
    if (this.natsClient) {
      this.natsClient.close();
    }
    if (this.hemeraClient) {
      this.hemeraClient.close();
    }
  }

  createHemeraClient(): Hemera<{}, {}> {
    return new Hemera(this.natsClient, this.options.hemera);
  }

  createNatsClient(): Client {
    return natsPackage.connect({
      ...this.options.nats,
      url: this.url,
    });
  }

  handleError(stream) {
    stream.on(ERROR_EVENT, err => this.logger.error(err));
  }

  async handleMessage(pattern: string, req: any) {
    const handler = this.getHandlerByPattern(pattern);
    if (!handler) {
      throw new Error(`No handler for pattern: ${pattern}`);
    }
    const result = await handler(req.payload);
    return result instanceof Observable
      ? this.resolveObservable(result)
      : result;
  }

  handleObservableError(err: any) {
    throw err instanceof Error
      ? err
      : new Error(err.message ? err.message : err);
  }

  listen(callback: () => void) {
    this.handleError(this.natsClient);
    this.start(callback);
  }

  async resolveObservable(result: Observable<{}>) {
    try {
      return await result.toPromise();
    } catch (err) {
      return this.handleObservableError(err);
    }
  }

  start(callback: () => void) {
    this.hemeraClient.ready(err => {
      if (err) {
        throw err;
      }
      this.bindEvents(this.hemeraClient);
      callback();
    });
  }
}
