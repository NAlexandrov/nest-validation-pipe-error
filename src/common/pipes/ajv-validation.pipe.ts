import * as Ajv from 'ajv';

// tslint:disable no-duplicate-imports
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AjvValidationPipe implements PipeTransform {
  private readonly ajv: Ajv.Ajv;

  constructor(
    private readonly schema: string | boolean | object,
    private readonly ajvOptions: Ajv.Options = {
      coerceTypes: true,
      removeAdditional: true,
    },
  ) {
    this.ajv = new Ajv(this.ajvOptions);
  }

  transform(data: { [key: string]: any }) {
    console.log('INCOMING DATA:', data);

    const valid = this.ajv.validate(this.schema, data);

    if (!valid) {
      throw new BadRequestException(this.ajv.errorsText());
    }

    return data;
  }
}
