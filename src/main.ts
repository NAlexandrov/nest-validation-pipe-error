import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HemeraTransport } from './common/Hemera';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new HemeraTransport({
      hemera: {
        childLogger: true,
        logLevel: 'error',
        timeout: 60 * 60 * 1000,
      },
      nats: {
        pass: process.env.smp_nats__password,
        reconnectTimeWait: 5000,
      },
    }),
  });

  await NestFactory.create(AppModule);

  await app.listen(() => {
    if (process && typeof process.send === 'function') {
      process.send('ready');
    }
  });
}
bootstrap();
