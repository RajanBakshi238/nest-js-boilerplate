import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IDatabaseOptionsService } from '../interfaces/database.options-service.interface';
import { MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class DatabaseOptionsService implements IDatabaseOptionsService {
  constructor(private readonly configService: ConfigService) {}

  createOptions(): MongooseModuleOptions {
    const host = this.configService.get<string>('database.host');
    const database = this.configService.get<string>('database.name');
    const user = this.configService.get<string>('database.user');
    const password = this.configService.get<string>('database.password');
    const debug = this.configService.get<string>('database.debug');

    const options = this.configService.get<string>('database.options')
      ? `?${this.configService.get<string>('database.options')}`
      : '';

    const timeoutOptions = this.configService.get<Record<string, number>>(
      'database.timeoutOptions',
    );

    let uri = host;

    if (database) {
      uri = `${uri}/${database}${options}`;
    }

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      autoCreate: true,
      ...timeoutOptions,
    };

    if (user && password) {
      mongooseOptions.auth = {
        username: user,
        password: password
      };
    }

    return mongooseOptions;
  }
}
