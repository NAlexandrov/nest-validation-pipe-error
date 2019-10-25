import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { AjvValidationPipe } from './common/pipes/ajv-validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({
    topic: 'test',
    cmd: 'test',
  })
  @UsePipes(
    new AjvValidationPipe({
      properties: {
        name: {
          type: 'string',
        },
      },
      required: ['name'],
      type: 'object',
    }),
  )
  getHello(payload: { name: string }): string {
    return this.appService.getHello(payload.name);
  }
}
